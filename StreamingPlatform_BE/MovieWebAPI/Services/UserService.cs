using BusinesObjects.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OData.Query;
using MovieWebAPI.Repository;
using MovieWebAPI.Services.IServices;
using System.IdentityModel.Tokens.Jwt;

namespace MovieWebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly UserRepository _userRepository;

        public UserService(ITokenService tokenService, UserManager<AppUser> userManager, UserRepository userRepository)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _userRepository = userRepository;
        }
        public async Task<AppUser> GetUserFromToken(string token)
        {
            var principal = _tokenService.GetPrincipalFromToken(token);
            if (principal == null) return null;
            var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
            if (string.IsNullOrEmpty(email)) return null;
            return await _userManager.FindByEmailAsync(email);

        }

        public async Task<bool> HasRole(AppUser user, string role)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return roles.Contains(role);
        }


        public async Task<List<object>> GetUsersWithRolesAsync()
        {
            return await _userRepository.GetUsersWithRolesAsync();
        }

        // Lấy chi tiết người dùng theo userId
        public async Task<AppUser> GetUserDetailAsync(string userId)
        {
            return await _userRepository.GetUserDetailAsync(userId);
        }

        // Cập nhật trạng thái IsActive của người dùng
        public async Task<bool> UpdateIsActiveAsync(string userId, bool isActive)
        {
            return await _userRepository.UpdateIsActiveAsync(userId, isActive);
        }
    }
}
