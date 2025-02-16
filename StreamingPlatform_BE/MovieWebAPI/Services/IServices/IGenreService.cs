using BusinesObjects.Dtos.request.Genre;
using BusinesObjects.Dtos.response.Genre;
using BusinesObjects.Models;

namespace MovieWebAPI.Services.IServices
{
    public interface IGenreService
    {
        Task<IEnumerable<GenreResponseDTO>> GetAllGenresAsync();
        Task<GenreResponseDTO> GetGenreByIdAsync(int genreId);
        Task<GenreResponseDTO> AddGenreAsync(NewGenreRequestDTO genreDto);
        Task<bool> UpdateGenreAsync(UpdateGenreRequestDTO genreDto);
        Task<bool> DeleteGenreAsync(int genreId);
        Task<bool> IsGenreExistsAsync(string genreName);
    }
}
