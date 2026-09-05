using Microsoft.AspNetCore.Mvc;
using SweetBite.API.Data;
using SweetBite.API.DTOs;
using SweetBite.API.Models;

namespace SweetBite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly SweetBiteDbContext _context;

    public InquiriesController(SweetBiteDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> SubmitInquiry([FromBody] CreateInquiryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var inquiry = new Inquiry
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Occasion = dto.Occasion,
            EstimatedGuests = dto.EstimatedGuests,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Thank you for reaching out! Our head baker will contact you within 24 hours." });
    }
}
