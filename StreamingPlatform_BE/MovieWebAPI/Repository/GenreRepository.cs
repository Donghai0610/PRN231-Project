using BusinesObjects;
using BusinesObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace MovieWebAPI.Repository
{
    public class GenreRepository
    {
        private readonly ApplicationDBContext _context;

        public GenreRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Genre>> GetAllGenresAsync()
        {
            return await _context.Genres.ToListAsync();
        }

        public async Task<Genre> GetGenreByIdAsync(int genreId)
        {
            return await _context.Genres.FirstOrDefaultAsync(g => g.GenreId == genreId);
        }

        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
            return genre; // Trả về Genre đã được thêm vào
        }

        public async Task<bool> UpdateGenreAsync(Genre genre)
        {
            _context.Genres.Update(genre);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteGenreAsync(int genreId)
        {
            var genre = await GetGenreByIdAsync(genreId);
            if (genre == null) return false;

            _context.Genres.Remove(genre);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> IsGenreExistsAsync(string genreName)
        {
            return !await _context.Genres.AnyAsync(g => g.Name == genreName);
            ;
        }

    }
}
