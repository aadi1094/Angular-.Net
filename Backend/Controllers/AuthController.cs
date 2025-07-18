using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowOrigin")]  // Add this attribute
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var response = await _authService.Login(loginRequest);
            
            if (!response.Success)
            {
                _logger.LogWarning("Login failed for user {Email}", loginRequest.Email);
                return BadRequest(response);
            }
            
            _logger.LogInformation("User {Email} logged in successfully with ID {UserId}", loginRequest.Email, response.UserId);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                _logger.LogInformation("Registration attempt for email: {Email}", registerRequest.Email);
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data" });
                }

                var response = await _authService.Register(registerRequest);
                
                if (!response.Success)
                {
                    return BadRequest(response);
                }
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", registerRequest.Email);
                return StatusCode(500, new { Success = false, Message = "Registration failed due to server error" });
            }
        }
    }
}
