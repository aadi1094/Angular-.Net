namespace Backend.DTOs
{
    public class CreateHouseDto
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
        public List<string>? Amenities { get; set; }
        public List<string>? AdditionalImages { get; set; }
        public string? ContactNumber { get; set; }
    }
}
