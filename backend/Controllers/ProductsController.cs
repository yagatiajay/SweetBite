using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBite.API.Data;
using SweetBite.API.DTOs;
using SweetBite.API.Models;

namespace SweetBite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly SweetBiteDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProductsController(SweetBiteDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] bool? isVeg,
        [FromQuery] bool? isGlutenFree)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(p => p.Category != null && (p.Category.Slug == category.ToLower() || p.Category.Name.ToLower() == category.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term) || 
                                     p.Description.ToLower().Contains(term) || 
                                     p.FlavourNotes.ToLower().Contains(term));
        }

        if (isVeg.HasValue && isVeg.Value)
        {
            query = query.Where(p => p.IsVeg);
        }

        if (isGlutenFree.HasValue && isGlutenFree.Value)
        {
            query = query.Where(p => p.IsGlutenFree);
        }

        var products = await query.ToListAsync();
        return Ok(products);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Product>>> GetFeatured()
    {
        var featured = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.IsFeatured)
            .Take(6)
            .ToListAsync();

        return Ok(featured);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound(new { message = "Product not found." });
        return Ok(product);
    }

    // --- Admin Endpoints ---

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var slug = dto.Name.ToLower().Trim().Replace(" ", "-").Replace("&", "and");
        int count = await _context.Products.CountAsync(p => p.Slug.StartsWith(slug));
        if (count > 0) slug = $"{slug}-{count + 1}";

        decimal? originalPrice = null;
        decimal finalPrice = dto.Price;
        if (dto.DiscountPercent > 0)
        {
            originalPrice = dto.Price;
            finalPrice = Math.Round(dto.Price * (1 - (dto.DiscountPercent / 100m)), 2);
        }

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Slug = slug,
            Tagline = dto.Tagline?.Trim() ?? string.Empty,
            Description = dto.Description.Trim(),
            Price = finalPrice,
            OriginalPrice = originalPrice,
            DiscountPercent = dto.DiscountPercent,
            StockQuantity = dto.StockQuantity,
            IsSoldOut = dto.StockQuantity <= 0,
            CategoryId = dto.CategoryId,
            WeightOrServings = dto.WeightOrServings?.Trim() ?? "1 Portion",
            IsVeg = dto.IsVeg,
            IsGlutenFree = dto.IsGlutenFree,
            IsFeatured = dto.IsFeatured,
            Rating = 5.0,
            ReviewCount = 1,
            ImageUrl = dto.ImageUrl.Trim(),
            FlavourNotes = dto.FlavourNotes?.Trim() ?? string.Empty,
            Ingredients = dto.Ingredients?.Trim() ?? string.Empty,
            Allergens = dto.Allergens?.Trim() ?? string.Empty
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        await _context.Entry(product).Reference(p => p.Category).LoadAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound(new { message = "Product not found." });

        decimal? originalPrice = null;
        decimal finalPrice = dto.Price;
        if (dto.DiscountPercent > 0)
        {
            originalPrice = dto.Price;
            finalPrice = Math.Round(dto.Price * (1 - (dto.DiscountPercent / 100m)), 2);
        }

        product.Name = dto.Name.Trim();
        product.Tagline = dto.Tagline?.Trim() ?? string.Empty;
        product.Description = dto.Description.Trim();
        product.Price = finalPrice;
        product.OriginalPrice = originalPrice;
        product.DiscountPercent = dto.DiscountPercent;
        product.StockQuantity = dto.StockQuantity;
        product.IsSoldOut = dto.IsSoldOut || dto.StockQuantity <= 0;
        product.CategoryId = dto.CategoryId;
        product.WeightOrServings = dto.WeightOrServings?.Trim() ?? "1 Portion";
        product.IsVeg = dto.IsVeg;
        product.IsGlutenFree = dto.IsGlutenFree;
        product.IsFeatured = dto.IsFeatured;
        product.ImageUrl = dto.ImageUrl.Trim();
        product.FlavourNotes = dto.FlavourNotes?.Trim() ?? string.Empty;
        product.Ingredients = dto.Ingredients?.Trim() ?? string.Empty;
        product.Allergens = dto.Allergens?.Trim() ?? string.Empty;

        await _context.SaveChangesAsync();
        return Ok(product);
    }

    [HttpPatch("{id:int}/stock")]
    public async Task<ActionResult<Product>> UpdateStock(int id, [FromBody] UpdateStockDto dto)
    {
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound(new { message = "Product not found." });

        product.StockQuantity = Math.Max(0, dto.StockQuantity);
        if (dto.IsSoldOut.HasValue)
        {
            product.IsSoldOut = dto.IsSoldOut.Value;
        }
        else
        {
            product.IsSoldOut = product.StockQuantity <= 0;
        }

        await _context.SaveChangesAsync();
        return Ok(product);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound(new { message = "Product not found." });

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Product deleted successfully." });
    }

    [HttpPost("upload-image")]
    public async Task<ActionResult> UploadImage([FromForm] IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No image file provided." });
        }

        var ext = Path.GetExtension(file.FileName).ToLower();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        if (!allowed.Contains(ext))
        {
            return BadRequest(new { message = "Allowed image formats: JPG, PNG, WEBP, GIF." });
        }

        var fileName = $"treat_{DateTime.UtcNow.Ticks}_{Guid.NewGuid().ToString().Substring(0, 6)}{ext}";

        // Save to frontend public/uploads directory for immediate instant static serving
        var frontendUploadPath = Path.Combine(_env.ContentRootPath, "..", "frontend", "public", "uploads");
        Directory.CreateDirectory(frontendUploadPath);
        var filePath = Path.Combine(frontendUploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Also copy to backend wwwroot/uploads if wwwroot exists
        try
        {
            var backendUploadPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
            Directory.CreateDirectory(backendUploadPath);
            System.IO.File.Copy(filePath, Path.Combine(backendUploadPath, fileName), true);
        }
        catch { }

        var publicUrl = $"/uploads/{fileName}";
        return Ok(new { imageUrl = publicUrl, fileName });
    }
}
