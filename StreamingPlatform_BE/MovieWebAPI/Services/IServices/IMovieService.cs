using BusinesObjects.Dtos.request.Movie;
using BusinesObjects.Dtos.response.Movie;

namespace MovieWebAPI.Services.IServices
{
    public interface IMovieService
    {
        Task<MovieResponseDTO> AddMovieAsync(AddMovieRequestDTO request);
        Task<List<MovieResponseDTO>> GetAllMoviesAsync();
        Task<MovieResponseDTO> GetMovieDetailAsync(int movieId);
        Task<MovieResponseDTO> UpdateMovieAsync(int movieId, UpdateMovieRequestDTO request);
        Task<MovieResponseDTO> DeleteMovieAsync(int movieId);

    }
}
