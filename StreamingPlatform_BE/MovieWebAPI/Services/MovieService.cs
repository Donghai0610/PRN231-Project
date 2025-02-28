using AutoMapper;
using BusinesObjects.Dtos.request.Movie;
using BusinesObjects.Dtos.response.Movie;
using BusinesObjects.Models;
using MovieWebAPI.Repository;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Services
{
    public class MovieService : IMovieService
    {
        private readonly MovieRepository _movieRepository;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;  // Inject CloudinaryService

        public MovieService(MovieRepository movieRepository, IMapper mapper, ICloudinaryService cloudinaryService)
        {
            _movieRepository = movieRepository;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;  // Initialize CloudinaryService
        }

        // Thêm bộ phim mới
        public async Task<MovieResponseDTO> AddMovieAsync(AddMovieRequestDTO request)
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
            if (request.Image != null)
            {
                movie.Image = await _cloudinaryService.UploadPhoto(request.Image, $"actor/{request.MovieName}"); 
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
            // Thêm diễn viên vào bộ phim
            if (request.ActorIds != null && request.ActorIds.Any())
            {
                foreach (var actorId in request.ActorIds)
                {
                    var movieActor = new MovieActor
                    {
                        MovieId = movie.MovieId,
                        ActorId = actorId
                    };
                    movie.MovieActors.Add(movieActor);
                }
            }

            // Thêm thể loại vào bộ phim
            if (request.GenreIds != null && request.GenreIds.Any())
            {
                foreach (var genreId in request.GenreIds)
                {
                    var movieGenre = new MovieGenre
                    {
                        MovieId = movie.MovieId,
                        GenreId = genreId
                    };
                    movie.MovieGenres.Add(movieGenre);
                }
            }

            await _movieRepository.UpdateMovieAsync(movie);  // Cập nhật lại bộ phim với diễn viên và thể loại
        }
    }
}
