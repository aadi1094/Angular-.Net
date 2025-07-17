using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var response = await _authService.Register(registerRequest);
            
            if (!response.Success)
            {
                return BadRequest(response);
            }
            
            return Ok(response);
        }
    }
}
