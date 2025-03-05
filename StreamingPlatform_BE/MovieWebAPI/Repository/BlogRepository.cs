using BusinesObjects.Models;
using BusinesObjects;
using Microsoft.EntityFrameworkCore;

namespace MovieWebAPI.Repository
{
    public class BlogRepository
    {
        private readonly ApplicationDBContext _context;

        public BlogRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        // Create Blog
        public async Task<Blog> CreateAsync(Blog blog)
        {
            // Nếu Blog có liên kết với Movie, gán MovieId
            if (blog.MovieId != null)
            {
                var movie = await _context.Movies.FindAsync(blog.MovieId);
                if (movie != null)
                {
                    blog.Movie = movie;
                }
            }

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public async Task<List<Blog>> GetAllAsync()
        {
            return await _context.Blogs.Include(b => b.Movie).Include(b => b.AppUser).ToListAsync();
        }

        // Get Blog by Id
        public async Task<Blog> GetByIdAsync(int id)
        {
            return await _context.Blogs.Include(b => b.Movie).Include(b => b.AppUser)
                                       .FirstOrDefaultAsync(b => b.BlogId == id);
        }

        // Update Blog
        public async Task<Blog> UpdateAsync(Blog blog)
        {
            var existingBlog = await _context.Blogs.FindAsync(blog.BlogId);
            if (existingBlog == null)
            {
                return null;  // Blog không tồn tại
            }

            // Cập nhật thông tin blog
            existingBlog.Title = blog.Title;
            existingBlog.Content = blog.Content;
            existingBlog.DatePosted = blog.DatePosted;
            existingBlog.MovieId = blog.MovieId;

            // Nếu Blog có liên kết với Movie, gán MovieId
            if (blog.MovieId != null)
            {
                var movie = await _context.Movies.FindAsync(blog.MovieId);
                if (movie != null)
                {
                    existingBlog.Movie = movie;
                }
            }

            _context.Blogs.Update(existingBlog);
            await _context.SaveChangesAsync();
            return existingBlog;
        }

        // Delete Blog
        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return false;  // Blog không tồn tại
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
