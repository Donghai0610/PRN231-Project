using BusinesObjects.Models;
using System.Security.Claims;

namespace MovieWebAPI.Services.IServices
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
        ClaimsPrincipal GetPrincipalFromToken(string token);

    }
}
