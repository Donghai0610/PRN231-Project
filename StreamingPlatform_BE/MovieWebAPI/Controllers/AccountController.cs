using AutoMapper;
using BusinesObjects.Dtos.request.Auth;
using BusinesObjects.Dtos.response.Auth;
using BusinesObjects.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public AccountController(UserManager<AppUser> userManager, IMapper mapper, SignInManager<AppUser> signInManager, ITokenService token, IEmailService emailService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _signInManager = signInManager;
            _tokenService = token;
            _emailService = emailService;
        }

        // Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequest)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName);
            if (user == null) return Unauthorized("Invalid Username or Password");

            // Kiểm tra trạng thái tài khoản có active không
            if (!user.isActive)
            {
                return Unauthorized("Account not activated. Please check your email to activate your account.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginRequest.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid Username or Password");

            return Ok(new ResponseApiDTO<string>("Success", "Login Successfully!", _tokenService.CreateToken(user)));
        }

        // Đăng ký
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var appUser = new AppUser
                {
                    Email = request.Email,
                    UserName = request.UserName
                };

                var createdUser = await _userManager.CreateAsync(appUser, request.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "Customer");
                    if (roleResult.Succeeded)
                    {
                        var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);

                        var activationLink = $"http://localhost:5066/api/account/confirm-email?userId={appUser.Id}&token={Uri.EscapeDataString(token)}";

                        await _emailService.SendRegistrationEmailAsync(appUser.Email, appUser.UserName, activationLink);

                        var userResponse = _mapper.Map<RegisterResponseDTO>(appUser);

                        ResponseApiDTO<RegisterResponseDTO> response
                            = new ResponseApiDTO<RegisterResponseDTO>("Success", "Register Successfully! Please check your email to activate your account.", userResponse);
                        return Ok(response);
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // Xác thực email
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
            {
                return BadRequest("User ID or Token is invalid.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest("Invalid User.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                user.isActive = true;
                await _userManager.UpdateAsync(user);
                return Ok("Email confirmed successfully. You can now log in.");
            }
            else
            {
                return BadRequest("Email confirmation failed.");
            }
        }




        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest("Email not found.");
            }

            // Tạo Token cho việc reset mật khẩu
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Tạo liên kết với token để người dùng có thể click vào để reset mật khẩu
            var resetLink = Url.Action("ResetPassword", "Account", new { token = token, email = request.Email }, Request.Scheme);

            // Gửi email cho người dùng
            await _emailService.SendForgotPasswordEmailAsync(user.Email, user.UserName, resetLink);

            return Ok(new ResponseApiDTO<string>("Success", "Password reset link has been sent to your email.", null));
        }





        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromQuery] string token, [FromQuery] string email, [FromBody] ResetPasswordRequestDTO request)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest("Token or email is missing.");
            }

            // Kiểm tra thông tin email và token
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Invalid request.");
            }

            // Gọi ResetPasswordAsync để reset mật khẩu
            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new ResponseApiDTO<string>("Success", "Password has been reset successfully.", null));
            }

            // Nếu reset thất bại, in ra lỗi cụ thể từ result.Errors
            var errorMessages = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new ResponseApiDTO<string>("Error", "Password reset failed.", string.Join(", ", errorMessages)));
        }


    }
}
