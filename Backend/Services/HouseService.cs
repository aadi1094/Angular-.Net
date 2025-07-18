using Backend.Database;
using Backend.Database.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Services
{
    public class HouseService : IHouseService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<HouseService> _logger;

        public HouseService(AppDbContext context, ILogger<HouseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<HouseDto>> GetAllHousesAsync()
        {
            var houses = await _context.Houses
                .Include(h => h.Owner)
                .Where(h => !h.IsDeleted)
                .ToListAsync();
                
            return houses.Select(house => new HouseDto
            {
                Id = house.Id,
                Name = house.Name,
                Price = house.Price,
                Area = house.Area,
                City = house.City,
                AreaSize = house.AreaSize,
                ImageUrl = house.ImageUrl,
                Type = house.Type,
                Bedrooms = house.Bedrooms,
                Bathrooms = house.Bathrooms,
                PropertyType = house.PropertyType,
                Description = house.Description,
                OwnerId = house.OwnerId
            });
        }

        public async Task<HouseDto?> GetHouseByIdAsync(int id)
        {
            var house = await _context.Houses.FindAsync(id);
            if (house == null || house.IsDeleted)
                return null;
                
            return new HouseDto
            {
                Id = house.Id,
                Name = house.Name,
                Price = house.Price,
                Area = house.Area,
                City = house.City,
                AreaSize = house.AreaSize,
                ImageUrl = house.ImageUrl,
                Type = house.Type,
                Bedrooms = house.Bedrooms,
                Bathrooms = house.Bathrooms,
                PropertyType = house.PropertyType,
                Description = house.Description,
                OwnerId = house.OwnerId
            };
        }

        public async Task<HouseDto> CreateHouseAsync(CreateHouseDto houseDto, int userId)
        {
            var house = new House
            {
                Name = houseDto.Name,
                Price = houseDto.Price,
                Area = houseDto.Area,
                City = houseDto.City,
                AreaSize = houseDto.AreaSize,
                ImageUrl = houseDto.ImageUrl,
                AdditionalImages = houseDto.AdditionalImages?.ToList() ?? new List<string>(),
                Type = houseDto.Type,
                Bedrooms = houseDto.Bedrooms,
                Bathrooms = houseDto.Bathrooms,
                PropertyType = houseDto.PropertyType,
                Description = houseDto.Description,
                OwnerId = userId,
                Amenities = houseDto.Amenities
            };

            await _context.Houses.AddAsync(house);
            await _context.SaveChangesAsync();

            return new HouseDto
            {
                Id = house.Id,
                Name = house.Name,
                Price = house.Price,
                Area = house.Area,
                City = house.City,
                AreaSize = house.AreaSize,
                ImageUrl = house.ImageUrl,
                Type = house.Type,
                Bedrooms = house.Bedrooms,
                Bathrooms = house.Bathrooms,
                PropertyType = house.PropertyType,
                Description = house.Description,
                OwnerId = house.OwnerId,
                
            };
        }

        public async Task<bool> UpdateHouseAsync(int id, CreateHouseDto houseDto, int userId)
        {
            var house = await _context.Houses.FindAsync(id);
            
            if (house == null || house.OwnerId != userId)
            {
                return false;
            }

            // Update properties
            house.Name = houseDto.Name;
            house.Price = houseDto.Price;
            house.Area = houseDto.Area;
            house.City = houseDto.City;
            house.AreaSize = houseDto.AreaSize;
            house.ImageUrl = houseDto.ImageUrl;
            house.Type = houseDto.Type;
            house.Bedrooms = houseDto.Bedrooms;
            house.Bathrooms = houseDto.Bathrooms;
            house.PropertyType = houseDto.PropertyType;
            house.Description = houseDto.Description;
            house.Amenities = houseDto.Amenities;
            house.AdditionalImages = houseDto.AdditionalImages;

            _context.Houses.Update(house);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHouseAsync(int id, int userId)
        {
            var house = await _context.Houses.FindAsync(id);
            if (house == null || house.OwnerId != userId)
                return false;

            // Soft delete
            house.IsDeleted = true;
            house.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<HouseDto>> GetHousesByTypeAsync(string type)
        {
            var houses = await _context.Houses
                .Where(h => h.Type.ToLower() == type.ToLower() && !h.IsDeleted)
                .ToListAsync();

            return houses.Select(house => new HouseDto
            {
                Id = house.Id,
                Name = house.Name,
                Price = house.Price,
                Area = house.Area,
                City = house.City,
                AreaSize = house.AreaSize,
                ImageUrl = house.ImageUrl,
                Type = house.Type,
                Bedrooms = house.Bedrooms,
                Bathrooms = house.Bathrooms,
                PropertyType = house.PropertyType,
                Description = house.Description,
                OwnerId = house.OwnerId
            });
        }
    }
}
                