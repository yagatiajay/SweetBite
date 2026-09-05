namespace SweetBite.API.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal DiscountPercent { get; set; } = 0;
    public int StockQuantity { get; set; } = 20;
    public bool IsSoldOut { get; set; } = false;
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public string WeightOrServings { get; set; } = string.Empty;
    public bool IsVeg { get; set; } = true;
    public bool IsGlutenFree { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public double Rating { get; set; } = 4.9;
    public int ReviewCount { get; set; } = 42;
    public string ImageUrl { get; set; } = string.Empty;
    public string FlavourNotes { get; set; } = string.Empty;
    public string Ingredients { get; set; } = string.Empty;
    public string Allergens { get; set; } = string.Empty;
}
