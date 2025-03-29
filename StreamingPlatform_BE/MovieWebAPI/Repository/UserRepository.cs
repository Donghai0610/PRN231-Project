using BusinesObjects.Models;
using BusinesObjects;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace MovieWebAPI.Repository
{
    public class UserRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRepository(ApplicationDBContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<List<object>> GetUsersWithRolesAsync()
        {
            var usersWithRoles = new List<object>();

            // Retrieve all users
            var users = await _context.Users.ToListAsync();

            foreach (var user in users)
            {
                // Get the roles for the user
                var roles = await _userManager.GetRolesAsync(user);

                // Combine user info with roles
                usersWithRoles.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.isActive,
                    user.CreatedAt,
                    Roles = roles // List of roles
                });
            }

            return usersWithRoles;
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
