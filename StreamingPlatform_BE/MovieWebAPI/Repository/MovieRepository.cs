using BusinesObjects;
using BusinesObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace MovieWebAPI.Repository
{
    public class MovieRepository
    {
        private readonly ApplicationDBContext _context;
        public MovieRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        // Thêm một bộ phim mới vào cơ sở dữ liệu
        public async Task<Movie> AddMovieAsync(Movie movie)
        {
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();
            return movie;
        }


        // Lấy danh sách tất cả các bộ phim
        public async Task<List<Movie>> GetMoviesAsync()
        {
            return await _context.Movies
                 .Include(m => m.MovieGenres)
                 .ThenInclude(ma => ma.Genre)
                 .Include(m => m.MovieActors)
                     .ThenInclude(ma => ma.Actor)
                 .Include(m => m.Comments)
                 .Include(m => m.Reviews)
                 .ToListAsync();
        }

        // Lấy chi tiết một bộ phim theo MovieId
        public async Task<Movie> GetMovieDetailAsync(int movieId)
        {
            return await _context.Movies
                .Include(m => m.MovieGenres)
                .ThenInclude(ma => ma.Genre)
                .Include(m => m.MovieActors).
                    ThenInclude(ma => ma.Actor)
                .Include(m => m.Comments)
                .Include(m => m.Reviews)
                .FirstOrDefaultAsync(m => m.MovieId == movieId);
        }

        // Cập nhật thông tin một bộ phim
        public async Task<Movie> UpdateMovieAsync(Movie movie)
        {
            _context.Movies.Update(movie);
            await _context.SaveChangesAsync();
            return movie;
        }

        // Xóa một bộ phim bằng cách đặt isActive = false
        public async Task<Movie> DeleteMovieAsync(int movieId)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == movieId);
            if (movie != null)
            {
                movie.isActive = false; // Đặt isActive bằng false thay vì xóa phim
                _context.Movies.Update(movie);
                await _context.SaveChangesAsync();
            }
            return movie;
        }

        public async Task<bool> CheckMovieExistsByNameAsync(string movieName)
        {
            var movieExists = await _context.Movies
                .AnyAsync(m => m.MovieName.Equals(movieName));
            return movieExists;
        }


        public async Task<bool> UpdateMovieStatusAsync(int movieId, bool isActive)
        {
            // Lấy movie theo movieId
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == movieId);
            if (movie == null)
            {
                return false; // Movie không tìm thấy
            }

            // Cập nhật trường isActive
            movie.isActive = isActive;

            // Lưu thay đổi
            _context.Movies.Update(movie);
            var result = await _context.SaveChangesAsync();

            return result > 0; // Trả về true nếu lưu thành công
        }

    }
}
