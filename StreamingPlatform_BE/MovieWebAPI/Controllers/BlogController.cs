using AutoMapper;
using BusinesObjects.Dtos.request.Blog;
using BusinesObjects.Dtos.response.Auth;
using BusinesObjects.Dtos.response.Blog;
using BusinesObjects.Dtos.response.Movie;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using MovieWebAPI.Services.IServices;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MovieWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;



        public BlogController(IBlogService blogService, IUserService userService, IMapper mapper)
        {
            _blogService = blogService;
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/blogs (Admin và User có thể xem danh sách bài viết)
        [HttpGet]
        [Authorize(Roles = "Admin,Customer")]
        [EnableQuery]
        public async Task<IActionResult> GetAllBlogs([FromHeader(Name = "Authorization")] string header)
        {

            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);

            if (user == null) return Unauthorized("User not found or token is invalid");

            var blogs = await _blogService.GetAllBlogsAsync();
            return Ok(blogs);
        }

        // GET: api/blogs/{id} (Admin và User có thể xem chi tiết bài viết)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Customer")]
        public async Task<IActionResult> GetBlogById(int id, [FromHeader(Name = "Authorization")] string header)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);

            if (user == null) return Unauthorized("User not found or token is invalid");

            var blog = await _blogService.GetBlogByIdAsync(id);
            if (blog == null)
            {
                return NotFound("Blog not found.");
            }

            return Ok(blog);
        }

        // POST: api/blogs (Chỉ Admin có thể tạo bài viết)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBlog([FromForm] BlogRequestDTO request, [FromHeader(Name = "Authorization")] string header)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);


            if (user == null) return Unauthorized("User not found or token is invalid");
           
            try
            {
                var createdBlog = await _blogService.CreateBlogAsync(request);
                var createdBlogResponse = _mapper.Map<BlogResponseDTO>(createdBlog);
                if (createdBlogResponse == null)
                {

                    return BadRequest("Create Blog Failed");
                }
                var resopnseApi = new ResponseApiDTO<BlogResponseDTO>("200", "Create Blog Successfully", createdBlogResponse);
                return Ok(resopnseApi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }

        }

        // PUT: api/blogs/{id} (Chỉ Admin có thể cập nhật bài viết)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] UpdateBlogRequestDTO request, [FromHeader(Name = "Authorization")] string header)
        {

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);

            if (user == null) return Unauthorized("User not found or token is invalid");

            if (id != request.BlogId)
            {
                return BadRequest("Blog ID mismatch.");
            }
            try
            {
               
                var updatedBlog = await _blogService.UpdateBlogAsync(id, request);
                if (updatedBlog == null)
                {
                    return NotFound("Blog not found.");
                }
                var updatedBlogResponse = _mapper.Map<BlogResponseDTO>(updatedBlog);
                var resopnseApi = new ResponseApiDTO<BlogResponseDTO>("200", "Create Movie Successfully", updatedBlogResponse);

                return Ok(resopnseApi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }

        }

        // DELETE: api/blogs/{id} (Chỉ Admin có thể xóa bài viết)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBlog(int id, [FromHeader(Name = "Authorization")] string header)
        {

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);

            if (user == null) return Unauthorized("User not found or token is invalid");


            var isDeleted = await _blogService.DeleteBlogAsync(id);
            if (!isDeleted)
            {
                return NotFound("Blog not found.");
            }

            var response = new ResponseApiDTO<string>("200", "Delete Blog Successfully", "Blog deleted successfully");
            return Ok(response);
        }
    }
}

