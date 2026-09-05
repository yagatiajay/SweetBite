using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBite.API.Data;
using SweetBite.API.Models;

namespace SweetBite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly SweetBiteDbContext _context;

    public CategoriesController(SweetBiteDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return Ok(categories);
    }
}
