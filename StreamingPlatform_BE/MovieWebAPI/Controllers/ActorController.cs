using AutoMapper;
using BusinesObjects.Dtos;
using BusinesObjects.Dtos.request.Actor;
using BusinesObjects.Dtos.response.Actor;
using BusinesObjects.Dtos.response.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActorController : ControllerBase
    {
        private readonly IActorService _actorService;
        private readonly ITokenService _tokenService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public ActorController(IActorService actorService, ITokenService tokenService, IUserService userService, IMapper mapper)
        {
            _actorService = actorService;
            _tokenService = tokenService;
            _userService = userService;
            _mapper = mapper;
        }

        // Phương thức GET để lấy actor theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActorById(int id)
        {
            var actor = await _actorService.GetActorByIdAsync(id);
            if (actor == null)
                return NotFound("Actor not found");

            return Ok(actor);  // Trả về ActorResponseDTO
        }

        // Lấy tất cả actor (Chỉ Admin được phép thực hiện)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllActors([FromQuery] UrlQueryParameters queryParameters, [FromHeader(Name = "Authorization")] string header)
        {
            // Kiểm tra tính hợp lệ của ModelState
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Kiểm tra tính hợp lệ của token
            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);

            // Kiểm tra xem người dùng có tồn tại không và token hợp lệ
            if (user == null)
                return Unauthorized("User not found or token is invalid");

            // Gọi service để lấy tất cả actors với phân trang và tìm kiếm
            var result = await _actorService.GetAllActorsAsync(queryParameters);

            // Trả về dữ liệu phân trang với thông tin actor
            return Ok(result);
        }


        // Thêm actor mới (Chỉ Admin được phép thực hiện)
        [Authorize(Roles = "Admin")]
        [HttpPost]// Chỉ cho phép Admin truy cập
        public async Task<IActionResult> AddActor([FromForm] AddActorRequestDTO requestDTO, [FromHeader(Name = "Authorization")] string header)
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
                if (requestDTO.Image == null)
                    return BadRequest("Image is required!");

                // Gọi service để thêm actor
                var actor = await _actorService.AddActorAsync(requestDTO, requestDTO.Image);
                if (actor == null)
                    return BadRequest("Create Actor Fail");

                // Trả về kết quả thành công
                var actorResponseDTO = _mapper.Map<ActorResponseDTO>(actor);
                var response = new ResponseApiDTO<ActorResponseDTO>("success", "Create actor successfully", actorResponseDTO);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                // Trả về BadRequest nếu actor đã tồn tại
                return BadRequest(ex.Message);  // Trả về thông điệp lỗi từ exception (Actor already exists)
            }
            catch (Exception ex)
            {
                // Bắt các lỗi khác và trả về lỗi chung
                return StatusCode(500, new { message = "An error occurred while creating the actor.", details = ex.Message });
            }
        }

        // Cập nhật actor (Chỉ Admin được phép thực hiện)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]  // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> UpdateActor(int id, [FromBody] UpdateActorRequestDTO actorDto, [FromHeader(Name = "Authorization")] string header)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);
            if (user == null) return Unauthorized("User not found or token is invalid!");

            if (id != actorDto.ActorId) return BadRequest("Actor ID mismatch.");

            try
            {
                var result = await _actorService.UpdateActorAsync(actorDto);
                if (!result) return NotFound("Actor not found");

                var response = new ResponseApiDTO<UpdateActorRequestDTO>("success", "Update actor successfully", actorDto);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                // Trả về BadRequest nếu actor đã tồn tại
                return BadRequest(ex.Message);  // Trả về thông điệp lỗi từ exception (Actor already exists)
            }
            catch (Exception ex)
            {
                // Bắt các lỗi khác và trả về lỗi chung
                return StatusCode(500, new { message = "An error occurred while updating the actor.", details = ex.Message });
            }
        }

        // Xóa actor (Chỉ Admin được phép thực hiện)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]  // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> DeleteActor(int id, [FromHeader(Name = "Authorization")] string header)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                return Unauthorized("Invalid or missing authorization token!");

            var token = header["Bearer ".Length..].Trim();
            var user = await _userService.GetUserFromToken(token);
            if (user == null) return Unauthorized("User not found or token is invalid!");

            var result = await _actorService.DeleteActorAsync(id);
            if (!result) return NotFound("Actor not found");

            return Ok("Actor deleted successfully");
        }
    }
}
