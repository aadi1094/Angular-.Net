using Backend.Database.Models;
using Backend.DTOs;

namespace Backend.Services
{
    public interface IHouseService
    {
        // Methods currently implemented in HouseService
        Task<IEnumerable<HouseDto>> GetAllHousesAsync();
        Task<HouseDto?> GetHouseByIdAsync(int id);
        Task<HouseDto> CreateHouseAsync(CreateHouseDto houseDto, int userId);
        Task<bool> UpdateHouseAsync(int id, CreateHouseDto houseDto, int userId);
        Task<bool> DeleteHouseAsync(int id, int userId);
        Task<IEnumerable<HouseDto>> GetHousesByTypeAsync(string type);
    }
}
