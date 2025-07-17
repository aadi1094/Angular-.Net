using Backend.Database;
using Backend.Database.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class HouseService : IHouseService
    {
        private readonly AppDbContext _context;

        public HouseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HouseDto>> GetAllHousesAsync()
        {
            var houses = await _context.Houses.ToListAsync();
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
            if (house == null)
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
            // First verify the user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exceptions.EntityNotFoundException($"User with ID {userId} not found");
            }

            var house = new House
            {
                Name = houseDto.Name,
                Price = houseDto.Price,
                Area = houseDto.Area,
                City = houseDto.City,
                AreaSize = houseDto.AreaSize,
                ImageUrl = houseDto.ImageUrl,
                Type = houseDto.Type,
                Bedrooms = houseDto.Bedrooms,
                Bathrooms = houseDto.Bathrooms,
                PropertyType = houseDto.PropertyType,
                Description = houseDto.Description,
                OwnerId = userId,
                Amenities = houseDto.Amenities,
                AdditionalImages = houseDto.AdditionalImages
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
            var house = await _context.Houses
                .Include(h => h.Owner)
                .FirstOrDefaultAsync(h => h.Id == id);
            
            if (house == null || (house.OwnerId != userId && house.Owner?.Role != "Admin"))
            {
                return false;
            }

            _context.Houses.Remove(house);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<HouseDto>> GetHousesByTypeAsync(string type)
        {
            var houses = await _context.Houses
                .Where(h => h.Type.ToLower() == type.ToLower())
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
