namespace Backend.Database.Models
{
    public class House
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Area { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public int AreaSize { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "For Rent" or "For Sale"
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public string PropertyType { get; set; } = string.Empty; // house, apartment, etc.
        public string Description { get; set; } = string.Empty;
        
        // Foreign key for User
        public int? OwnerId { get; set; }
        public User? Owner { get; set; }

        // Add these new properties
        public List<string>? Amenities { get; set; }
        public List<string>? AdditionalImages { get; set; }
    }
}
