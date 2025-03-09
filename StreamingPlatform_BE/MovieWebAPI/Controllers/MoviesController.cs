using AutoMapper;
using BusinesObjects.Dtos.request.Movie;
using BusinesObjects.Dtos.response.Auth;
using BusinesObjects.Dtos.response.Movie;
using BusinesObjects.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;  // Inject IUserService for token validation

        public MoviesController(IMovieService movieService, IMapper mapper, IUserService userService)
        {
            _movieService = movieService;
            _mapper = mapper;
            _userService = userService;
        }




        [HttpGet]
        [EnableQuery]
        [Authorize(Roles = "Admin,Customer")]// Kích hoạt OData query, cho phép phân trang, lọc, sắp xếp
        public async Task<IActionResult> GetAllMovies([FromHeader(Name = "Authorization")] string header)
        {
            var user = await ValidateToken(header);
            if (user == null)
                return Unauthorized("User not found or token is invalid");

            try
            {
                var movies = await _movieService.GetAllMoviesAsync();
                return Ok(movies);  // Trả về danh sách phim
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        // Phương thức GET để lấy movie theo ID (User và Admin có thể truy cập)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Customer")]
        public async Task<IActionResult> GetMovieById(int id, [FromHeader(Name = "Authorization")] string header)
        {
            var user = await ValidateToken(header);
            if (user == null)
                return Unauthorized("User not found or token is invalid");

            var movie = await _movieService.GetMovieDetailAsync(id);
            if (movie == null)
                return NotFound("Movie not found");

            return Ok(movie);  // Trả về MovieResponseDTO
        }

        // Thêm movie mới (Chỉ Admin được phép thực hiện)
        [Authorize(Roles = "Admin")]
        [HttpPost]  // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> AddMovie([FromForm] AddMovieRequestDTO requestDTO, [FromHeader(Name = "Authorization")] string header)
        {
            var user = await ValidateToken(header);
            if (user == null)
                return Unauthorized("User not found or token is invalid!");

            try
            {
                if (requestDTO.Image == null)
                    return BadRequest("Image is required!");

                var movie = await _movieService.AddMovieAsync(requestDTO, requestDTO.Image);
                if (movie == null)
                    return BadRequest("Failed to create movie");

                var movieResponseDTO = _mapper.Map<MovieResponseDTO>(movie);
                if (movieResponseDTO == null)
                    return BadRequest("Failed to create movie");
                var resopnseApi = new ResponseApiDTO<MovieResponseDTO>("200", "Create Movie Successfully", movieResponseDTO);
                return Ok(resopnseApi);
                // Trả về movie vừa tạo
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the movie.", details = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromForm] UpdateMovieRequestDTO requestDTO, [FromHeader(Name = "Authorization")] string header)
        {
            var user = await ValidateToken(header);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found or token is invalid!" });
            }

            if (id != requestDTO.MovieId)
            {
                return BadRequest(new { message = "Movie ID mismatch" });
            }

            try
            {
                var updatedMovie = await _movieService.UpdateMovieAsync(id, requestDTO);

                if (updatedMovie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                var movieResponseDTO = _mapper.Map<MovieResponseDTO>(updatedMovie);

                var responseApi = new ResponseApiDTO<MovieResponseDTO>("200", "Update Movie Successfully", movieResponseDTO);

                return Ok(responseApi);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the movie.", details = ex.Message });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id, [FromHeader(Name = "Authorization")] string header)
        {
            var user = await ValidateToken(header);
            if (user == null)
                return Unauthorized("User not found or token is invalid!");

            try
            {
                var deletedMovie = await _movieService.DeleteMovieAsync(id);
                if (deletedMovie == null)
                    return NotFound("Movie not found");

                return Ok("Movie deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the movie.", details = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateMovie(int id, [FromBody] bool isActive, [FromHeader(Name = "Authorization")] string header)
        {
            var user = await ValidateToken(header);
            if (user == null)
                return Unauthorized("User not found or token is invalid!");
            try
            {
                var result = await _movieService.UpdateMovieStatusAsync(id, isActive);

                if (!result)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                return Ok(new { message = "Movie status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }


        private async Task<AppUser> ValidateToken(string header)
        {
            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return null;

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);
            return user;
        }

    }
}

