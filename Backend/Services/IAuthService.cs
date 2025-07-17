using Backend.DTOs;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(LoginRequest request);
        Task<AuthResponse> Register(RegisterRequest request);
    }
}
