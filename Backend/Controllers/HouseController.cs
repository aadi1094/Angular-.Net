using Backend.Database.Models;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowOrigin")]
    public class HouseController : ControllerBase
    {
        private readonly IHouseService _houseService;
        private readonly ILogger<HouseController> _logger;

        public HouseController(IHouseService houseService, ILogger<HouseController> logger)
        {
            _houseService = houseService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]  // Add this to ensure unauthenticated access
        public async Task<IActionResult> GetAll()
        {
            try
            {
                _logger.LogInformation("Getting all houses");
                var houses = await _houseService.GetAllHousesAsync();
                return Ok(houses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all houses");
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var house = await _houseService.GetHouseByIdAsync(id);
            if (house == null)
                return NotFound();
            
            return Ok(house);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateHouseDto houseDto)
        {
            try
            {
                // Add logging to debug authorization
                _logger.LogInformation("User attempting to create house. Auth Header: {Auth}", Request.Headers["Authorization"].ToString());

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var result = await _houseService.CreateHouseAsync(houseDto, userId);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exceptions.EntityNotFoundException ex)
            {
                _logger.LogError(ex, "User not found");
                return NotFound(new { message = "User not found" });
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating house");
                return StatusCode(500, new { message = "Error creating house. Please verify your user account is valid." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating house");
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateHouseDto houseDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var result = await _houseService.UpdateHouseAsync(id, houseDto, userId);
                if (!result)
                {
                    return NotFound(new { message = "House not found or you don't have permission to edit it" });
                }
                
                return Ok(new { message = "House updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating house {HouseId}", id);
                return StatusCode(500, new { message = "Failed to update house" });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var success = await _houseService.DeleteHouseAsync(id, userId);
                if (!success)
                {
                    return NotFound(new { message = "House not found or you don't have permission to delete it" });
                }
                
                return Ok(new { message = "House deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting house {HouseId}", id);
                return StatusCode(500, new { message = "Failed to delete house" });
            }
        }
    }
}
