using AutoMapper;
using BusinesObjects.Dtos.request;
using BusinesObjects.Dtos.response;
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
    }
}
