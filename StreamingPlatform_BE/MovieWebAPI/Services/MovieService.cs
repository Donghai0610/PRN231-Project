using AutoMapper;
using BusinesObjects.Dtos.request.Movie;
using BusinesObjects.Dtos.response.Movie;
using BusinesObjects.Models;
using Microsoft.EntityFrameworkCore;
using MovieWebAPI.Repository;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Services
{
    public class MovieService : IMovieService
    {
        private readonly MovieRepository _movieRepository;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;  // Inject CloudinaryService
        private readonly ActorRepository actorRepository;
        private readonly GenreRepository genreRepository;

        public MovieService(MovieRepository movieRepository, IMapper mapper, ICloudinaryService cloudinaryService, ActorRepository actorRepository, GenreRepository genreRepository)
        {
            _movieRepository = movieRepository;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;  // Initialize CloudinaryService
            this.actorRepository = actorRepository;
            this.genreRepository = genreRepository;
        }

        // Thêm bộ phim mới
        public async Task<MovieResponseDTO> AddMovieAsync(AddMovieRequestDTO request, IFormFile photo)
        {
            // Kiểm tra phim có tồn tại không
            bool movieExists = await _movieRepository.CheckMovieExistsByNameAsync(request.MovieName);
            if (movieExists)
            {
                throw new Exception("A movie with this name already exists.");
            }

            // Mapping DTO thành Entity
            var movie = _mapper.Map<Movie>(request);

            // Nếu có ảnh, tải lên Cloudinary và lưu lại URL
            if (photo != null)
            {
                var uploadResult = await _cloudinaryService.UploadPhoto(photo, $"actor/{movie.MovieName}");

                movie.Image = uploadResult.ToString();
            }

            // Lưu phim vào cơ sở dữ liệu
            movie = await _movieRepository.AddMovieAsync(movie);

            // Thêm diễn viên và thể loại nếu có
            await AddActorsAndGenresAsync(movie, request);

            // Trả về DTO
            return _mapper.Map<MovieResponseDTO>(movie);
        }

        // Lấy danh sách tất cả các bộ phim
        public async Task<List<MovieResponseDTO>> GetAllMoviesAsync()
        {
            var movies = await _movieRepository.GetMoviesAsync();
            return _mapper.Map<List<MovieResponseDTO>>(movies);
        }

        // Lấy chi tiết một bộ phim
        public async Task<MovieResponseDTO> GetMovieDetailAsync(int movieId)
        {
            var movie = await _movieRepository.GetMovieDetailAsync(movieId);
            if (movie == null)
                return null;

            return _mapper.Map<MovieResponseDTO>(movie);
        }

        // Cập nhật thông tin của bộ phim
        
        // Xóa bộ phim (đặt isActive = false)
        public async Task<MovieResponseDTO> DeleteMovieAsync(int movieId)
        {
            var movie = await _movieRepository.DeleteMovieAsync(movieId);
            if (movie == null)
                throw new Exception("Movie not found.");

            return _mapper.Map<MovieResponseDTO>(movie);
        }

        // Thêm diễn viên và thể loại cho phim (Phương thức này sẽ được sử dụng trong các phương thức khác)
        private async Task AddActorsAndGenresAsync(Movie movie, AddMovieRequestDTO request)
        {
            try
            {
                // Lấy danh sách ActorIds hợp lệ
                if (request.ActorIds != null && request.ActorIds.Any())
                {
                    var validActorIds = await actorRepository.GetValidActorIdsAsync(request.ActorIds);
                    var invalidActorIds = request.ActorIds.Except(validActorIds).ToList();
                    if (invalidActorIds.Any())
                    {
                        throw new Exception($"These Actor IDs do not exist: {string.Join(", ", invalidActorIds)}");
                    }

                    // Đảm bảo MovieActors không null
                    if (movie.MovieActors == null)
                        movie.MovieActors = new List<MovieActor>();

                    foreach (var actorId in validActorIds)
                    {
                        var movieActor = new MovieActor
                        {
                            MovieId = movie.MovieId,
                            ActorId = actorId
                        };
                        movie.MovieActors.Add(movieActor);
                    }
                }

                // Tương tự cho Genre
                if (request.GenreIds != null && request.GenreIds.Any())
                {
                    var validGenreIds = await genreRepository.GetValidGenreIdsAsync(request.GenreIds);
                    var invalidGenreIds = request.GenreIds.Except(validGenreIds).ToList();
                    if (invalidGenreIds.Any())
                    {
                        throw new Exception($"These Genre IDs do not exist: {string.Join(", ", invalidGenreIds)}");
                    }

                    if (movie.MovieGenres == null)
                        movie.MovieGenres = new List<MovieGenre>();

                    foreach (var genreId in validGenreIds)
                    {
                        var movieGenre = new MovieGenre
                        {
                            MovieId = movie.MovieId,
                            GenreId = genreId
                        };
                        movie.MovieGenres.Add(movieGenre);
                    }
                }

                // Cuối cùng, update lại Movie
                await _movieRepository.UpdateMovieAsync(movie);
            }
            catch (DbUpdateException dbEx)
            {
                // Lấy chi tiết lỗi gốc
                var baseException = dbEx.GetBaseException();

                // Gộp message của EF + message gốc
                var errorMessage = $"Error in AddActorsAndGenresAsync: {dbEx.Message}. Details: {baseException.Message}";

                // Ném (throw) lại hoặc log, tuỳ bạn
                throw new Exception(errorMessage, dbEx);
            }
            catch (Exception ex)
            {
                // Bắt các lỗi khác (nếu có)
                throw new Exception($"Error in AddActorsAndGenresAsync: {ex.Message}", ex);
            }
        }
        public async Task<MovieResponseDTO> UpdateMovieAsync(int movieId, UpdateMovieRequestDTO request)
        {
            var movie = await _movieRepository.GetMovieDetailAsync(movieId);
            if (movie == null)
                throw new Exception("Movie not found.");

            // Kiểm tra xem tất cả ActorIds có tồn tại trong bảng Actors không
            if (request.ActorIds != null)
            {
                // Lấy danh sách tất cả ActorId hợp lệ từ bảng Actors
                var validActorIds = await actorRepository.GetValidActorIdsAsync(request.ActorIds);

                // Kiểm tra xem có ActorId nào không hợp lệ không
                var invalidActorIds = request.ActorIds.Except(validActorIds).ToList();
                if (invalidActorIds.Any())
                {
                    throw new Exception($"The following ActorIds are invalid: {string.Join(", ", invalidActorIds)}");
                }
            }

            try
            {
                // Nếu có ảnh mới, upload và cập nhật URL
                if (request.Image != null && request.Image.Length > 0)
                {
                    var uploadResult = await _cloudinaryService.UploadPhoto(request.Image, $"actor/{request.MovieName}");
                    movie.Image = uploadResult.ToString();
                }

                // Cập nhật các trường, nếu giá trị mới được gửi
                if (!string.IsNullOrWhiteSpace(request.MovieName))
                    movie.MovieName = request.MovieName;

                if (!string.IsNullOrWhiteSpace(request.Description))
                    movie.Description = request.Description;

                if (request.ReleaseDate != default(DateTime))
                    movie.ReleaseDate = request.ReleaseDate;

                if (!string.IsNullOrWhiteSpace(request.MovieUrl))
                    movie.MovieUrl = request.MovieUrl;

                if (request.isActive.HasValue) // Kiểm tra xem request có giá trị cho isActive không
                {
                    movie.isActive = request.isActive.Value;
                }

                // Cập nhật danh sách Actor
                if (request.ActorIds != null)
                {
                    var existingActorIds = movie.MovieActors.Select(ma => ma.ActorId).ToList();

                    var actorsToRemove = movie.MovieActors.Where(ma => !request.ActorIds.Contains(ma.ActorId)).ToList();
                    foreach (var ma in actorsToRemove)
                    {
                        movie.MovieActors.Remove(ma);
                    }

                    var actorsToAdd = request.ActorIds.Except(existingActorIds).ToList();
                    foreach (var actorId in actorsToAdd)
                    {
                        movie.MovieActors.Add(new MovieActor
                        {
                            MovieId = movie.MovieId,
                            ActorId = actorId
                        });
                    }
                }

                // Cập nhật danh sách Genre
                if (request.GenreIds != null)
                {
                    var existingGenreIds = movie.MovieGenres.Select(mg => mg.GenreId).ToList();

                    var genresToRemove = movie.MovieGenres.Where(mg => !request.GenreIds.Contains(mg.GenreId)).ToList();
                    foreach (var mg in genresToRemove)
                    {
                        movie.MovieGenres.Remove(mg);
                    }

                    var genresToAdd = request.GenreIds.Except(existingGenreIds).ToList();
                    foreach (var genreId in genresToAdd)
                    {
                        movie.MovieGenres.Add(new MovieGenre
                        {
                            MovieId = movie.MovieId,
                            GenreId = genreId
                        });
                    }
                }

                // Lưu thay đổi vào repository
                movie = await _movieRepository.UpdateMovieAsync(movie);

                // Map sang DTO để trả về
                return _mapper.Map<MovieResponseDTO>(movie);
            }
            catch (DbUpdateException dbEx)
            {
                // Bắt lỗi DB và in ra chi tiết từ InnerException
                var baseException = dbEx.GetBaseException();
                throw new Exception($"Database update failed: {baseException.Message}", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while updating the movie: {ex.Message}", ex);
            }
        }

        public async Task<bool> UpdateMovieStatusAsync(int movieId, bool isActive)
        {
            // Gọi repository để cập nhật movie
            var result = await _movieRepository.UpdateMovieStatusAsync(movieId, isActive);
            return result;
        }

    }
}
