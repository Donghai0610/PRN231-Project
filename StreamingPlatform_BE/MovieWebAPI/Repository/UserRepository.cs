using BusinesObjects.Models;
using BusinesObjects;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;

namespace MovieWebAPI.Repository
{
    public class UserRepository
    {
        private readonly ApplicationDBContext _context;

        public UserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        // Lấy tất cả người dùng với OData query options
        public IQueryable<AppUser> GetAllUsers()
        {
            return _context.Users.AsQueryable();
        }

        // Lấy chi tiết người dùng theo userId
        public async Task<AppUser> GetUserDetailAsync(string userId)
        {
            return await _context.Users
                                 .Where(u => u.Id == userId)
                                 .Include(u => u.Comment)
                                 .Include(u => u.Reviews)
                                 .Include(u => u.Blogs)
                                 .FirstOrDefaultAsync();
        }

        // Cập nhật trạng thái IsActive của người dùng
        public async Task<bool> UpdateIsActiveAsync(string userId, bool isActive)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                user.isActive = isActive;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
