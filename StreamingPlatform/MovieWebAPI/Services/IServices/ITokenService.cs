using BusinesObjects.Models;

namespace MovieWebAPI.Services.IServices
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);

    }
}
