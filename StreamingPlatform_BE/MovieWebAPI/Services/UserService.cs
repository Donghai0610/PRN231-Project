using BusinesObjects.Models;
using Microsoft.AspNetCore.Identity;
using MovieWebAPI.Services.IServices;
using System.IdentityModel.Tokens.Jwt;

namespace MovieWebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;

        public UserService(ITokenService tokenService, UserManager<AppUser> userManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
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
    }
}
