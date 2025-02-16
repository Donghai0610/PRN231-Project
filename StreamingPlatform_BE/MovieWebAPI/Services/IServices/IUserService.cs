using BusinesObjects.Models;
using System.Threading.Tasks;

namespace MovieWebAPI.Services.IServices
{
    public interface IUserService
    {
        Task<AppUser> GetUserFromToken(string token);

        Task<bool> HasRole(AppUser user, string role);
    }
}
