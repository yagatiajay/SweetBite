using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBite.API.Data;
using SweetBite.API.DTOs;
using SweetBite.API.Models;
using SweetBite.API.Services;

namespace SweetBite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SweetBiteDbContext _context;

    public AuthController(SweetBiteDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var emailLower = dto.Email.Trim().ToLower();
        var existing = await _context.Users.AnyAsync(u => u.Email == emailLower);
        if (existing)
        {
            return BadRequest(new { message = "An account with this email already exists." });
        }

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = emailLower,
            PasswordHash = PasswordHasher.HashPassword(dto.Password),
            Phone = dto.Phone?.Trim() ?? string.Empty,
            Address = dto.Address?.Trim() ?? string.Empty,
            Role = "Customer",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{user.Id}:{user.Email}:{DateTime.UtcNow.Ticks}"));

        return Ok(new AuthResponseDto
        {
            User = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role
            },
            Token = token,
            Message = "Registration successful! Welcome to Sweet Bite."
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var emailLower = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailLower);

        if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{user.Id}:{user.Email}:{DateTime.UtcNow.Ticks}"));

        return Ok(new AuthResponseDto
        {
            User = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role
            },
            Token = token,
            Message = $"Welcome back, {user.FullName}!"
        });
    }

    [HttpGet("user/{id:int}")]
    public async Task<ActionResult<UserDto>> GetUserProfile(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        return Ok(new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Role = user.Role
        });
    }
}
