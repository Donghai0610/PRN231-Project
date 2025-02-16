using AutoMapper;
using BusinesObjects.Dtos.request.Genre;
using BusinesObjects.Dtos.response;
using BusinesObjects.Dtos.response.Genre;
using BusinesObjects.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieWebAPI.Services;
using MovieWebAPI.Services.IServices;
using System.Reflection.PortableExecutable;
using System.Security.Claims;

namespace MovieWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _genreService;
        private readonly ITokenService _tokenService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;


        public GenreController(IGenreService genreService, ITokenService tokenService, IUserService userService, IMapper mapper)
        {
            _genreService = genreService;
            _tokenService = tokenService;
            _userService = userService;
            _mapper = mapper;
        }

        // Phương thức GET để lấy thể loại theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _genreService.GetGenreByIdAsync(id);
            if (genre == null)
                return NotFound("Genre not found");

            return Ok(genre);  // Trả về GenreResponseDTO
        }

        // Lấy tất cả thể loại (Chỉ Admin được phép thực hiện)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllGenres([FromHeader(Name = "Authorization")] string header)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);

            if (user == null) return Unauthorized("User not found or token is invalid");
            var genres = await _genreService.GetAllGenresAsync();
            var response = _mapper.Map<IEnumerable<GenreResponseDTO>>(genres);
            return Ok(response);

        }

        // Thêm thể loại mới (Chỉ Admin được phép thực hiện)
        [HttpPost]
        [Authorize(Roles = "Admin")]  // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> AddGenre([FromBody] NewGenreRequestDTO genreDto,
    [FromHeader(Name = "Authorization")] string header)
        {
            // Kiểm tra tính hợp lệ của ModelState
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Kiểm tra tính hợp lệ của token
            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();

            var user = await _userService.GetUserFromToken(token);
            if (user == null)
                return Unauthorized("User not found or token is invalid!");

            try
            {
                // Gọi service để thêm thể loại
                var genre = await _genreService.AddGenreAsync(genreDto);

                // Trả về kết quả thành công
                var genreResponseDTO = _mapper.Map<GenreResponseDTO>(genre);
                var response = new ResponseApiDTO<GenreResponseDTO>("success", "Create genre successfully", genreResponseDTO);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                // Trả về BadRequest nếu genre đã tồn tại
                return BadRequest(ex.Message);  // Trả về thông điệp lỗi từ exception (Genre already exists)
            }
            catch (Exception ex)
            {
                // Bắt các lỗi khác và trả về lỗi chung
                return StatusCode(500, new { message = "An error occurred while creating the genre.", details = ex.Message });
            }
        }


        // Cập nhật thể loại (Chỉ Admin được phép thực hiện)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]  // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] UpdateGenreRequestDTO genreDto, [FromHeader(Name = "Authorization")] string header)
        {

            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");
            var token = header["Bearer ".Length..].Trim();

            var user = await _userService.GetUserFromToken(token);
            if (user == null) return Unauthorized("User not found or token is invalid!");

            if (id != genreDto.GenreId) return BadRequest("Genre ID mismatch.");
            try
            {
                var result = await _genreService.UpdateGenreAsync(genreDto);
                if (!result) return NotFound("Genre not found");
                var response = new ResponseApiDTO<UpdateGenreRequestDTO>("success", "Update genre successfully", genreDto);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                // Trả về BadRequest nếu genre đã tồn tại
                return BadRequest(ex.Message);  // Trả về thông điệp lỗi từ exception (Genre already exists)
            }
            catch (Exception ex)
            {
                // Bắt các lỗi khác và trả về lỗi chung
                return StatusCode(500, new { message = "An error occurred while creating the genre.", details = ex.Message });
            }
            

        }

        // Xóa thể loại (Chỉ Admin được phép thực hiện)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]  // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> DeleteGenre(int id, [FromHeader(Name = "Authorization")] string header)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");
            var token = header["Bearer ".Length..].Trim();

            var user = await _userService.GetUserFromToken(token);
            if (user == null) return Unauthorized("User not found or token is invalid!");

            var result = await _genreService.DeleteGenreAsync(id);
            if (!result) return NotFound("Genre not found");
            return Ok("Genre deleted successfully");

        }
    }
}

