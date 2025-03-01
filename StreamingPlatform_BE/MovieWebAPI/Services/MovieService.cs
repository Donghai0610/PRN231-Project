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
        public async Task<MovieResponseDTO> UpdateMovieAsync(int movieId, UpdateMovieRequestDTO request)
        {
            var movie = await _movieRepository.GetMovieDetailAsync(movieId);
            if (movie == null)
                throw new Exception("Movie not found.");

            // Nếu có ảnh mới, tải lên Cloudinary và lưu lại URL
            if (request.Image != null)
            {
                movie.Image = await _cloudinaryService.UploadPhoto(request.Image, "movies");  // Upload ảnh lên Cloudinary
            }

            // Mapping DTO thành Entity và cập nhật
            _mapper.Map(request, movie);

            movie = await _movieRepository.UpdateMovieAsync(movie);

            return _mapper.Map<MovieResponseDTO>(movie);
        }

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

    }
}
