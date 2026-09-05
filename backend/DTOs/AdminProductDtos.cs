using System.ComponentModel.DataAnnotations;

namespace SweetBite.API.DTOs;

public class CreateProductDto
{
    [Required, MinLength(2)]
    public string Name { get; set; } = string.Empty;

    public string Tagline { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required, Range(0.01, 10000)]
    public decimal Price { get; set; }

    [Range(0, 99)]
    public decimal DiscountPercent { get; set; } = 0;

    [Range(0, 10000)]
    public int StockQuantity { get; set; } = 20;

    [Required]
    public int CategoryId { get; set; }

    public string WeightOrServings { get; set; } = "1 Portion";

    public bool IsVeg { get; set; } = true;

    public bool IsGlutenFree { get; set; } = false;

    public bool IsFeatured { get; set; } = false;

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    public string FlavourNotes { get; set; } = string.Empty;

    public string Ingredients { get; set; } = string.Empty;

    public string Allergens { get; set; } = string.Empty;
}

public class UpdateProductDto : CreateProductDto
{
    public bool IsSoldOut { get; set; } = false;
}

public class UpdateStockDto
{
    public int StockQuantity { get; set; }
    public bool? IsSoldOut { get; set; }
}

public class UpdateOrderStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Confirmed, Baking, Ready, Delivered
}
