using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Database;
using Backend.Database.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResponse> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return new AuthResponse { Success = false, Message = "User not found" };
            }

            var passwordHash = Convert.ToBase64String(
                System.Security.Cryptography.SHA256.Create()
                    .ComputeHash(Encoding.UTF8.GetBytes(request.Password))
            );

            if (user.PasswordHash != passwordHash)
            {
                return new AuthResponse { Success = false, Message = "Invalid password" };
            }

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Success = true,
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role ?? "User"
            };
        }

        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return new AuthResponse { Success = false, Message = "Email already in use" };
                }

                var passwordHash = Convert.ToBase64String(
                    System.Security.Cryptography.SHA256.Create()
                        .ComputeHash(Encoding.UTF8.GetBytes(request.Password))
                );

                var user = new User
                {
                    Email = request.Email,
                    Name = request.Name,
                    PasswordHash = passwordHash,
                    Role = "User"
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Token = token,
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for user {Email}", request.Email);
                throw;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not found in configuration")));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToInt32(jwtSettings["ExpiryInMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
