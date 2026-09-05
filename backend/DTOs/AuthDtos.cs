using System.ComponentModel.DataAnnotations;

namespace SweetBite.API.DTOs;

public class RegisterDto
{
    [Required, MinLength(2)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
}

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer";
}

public class AuthResponseDto
{
    public UserDto User { get; set; } = new();
    public string Token { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
