using BusinesObjects.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users (Lấy tất cả người dùng với OData)
        //[HttpGet]
        //[Authorize(Roles = "Admin")]
        //[EnableQuery]
        //public async Task<IActionResult> GetAllUsers([FromQuery] ODataQueryOptions<AppUser> queryOptions)
        //{
        //    var users = await _userService.GetAllUsersAsync(queryOptions);
        //    return Ok(users);
        //}

        // GET: api/users/{id} (Lấy chi tiết người dùng)
        //[HttpGet("{id}")]
        //[Authorize(Roles = "Admin,Customer")]
        //public async Task<IActionResult> GetUserDetail(string id)
        //{
        //    var user = await _userService.GetUserDetailAsync(id);
        //    if (user == null)
        //    {
        //        return NotFound("User not found.");
        //    }
        //    return Ok(user);
        //}

        //// PUT: api/users/{id}/isActive (Cập nhật trạng thái isActive)
        //[HttpPut("{id}/isActive")]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> UpdateIsActive(string id, [FromBody] bool isActive)
        //{
        //    var result = await _userService.UpdateIsActiveAsync(id, isActive);
        //    if (result)
        //    {
        //        return Ok("User status updated successfully.");
        //    }
        //    return NotFound("User not found.");
        //}
    }
}
