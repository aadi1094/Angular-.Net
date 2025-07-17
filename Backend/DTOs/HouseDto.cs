namespace Backend.DTOs
{
    public class HouseDto
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
        public int? OwnerId { get; set; }
    }

    public class CreateHouseDtoNew
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Area { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public int AreaSize { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public string PropertyType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
