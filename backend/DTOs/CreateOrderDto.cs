using System.ComponentModel.DataAnnotations;

namespace SweetBite.API.DTOs;

public class CreateOrderDto
{
    public int? UserId { get; set; }

    [Required]
    public string CustomerName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required]
    public string CustomerPhone { get; set; } = string.Empty;

    public string DeliveryType { get; set; } = "Delivery";

    public string DeliveryAddress { get; set; } = string.Empty;

    [Required]
    public string DeliveryDate { get; set; } = string.Empty;

    public string SpecialNotes { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = "Card";

    public string PaymentStatus { get; set; } = "Paid";

    [Required, MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateInquiryDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Occasion { get; set; } = string.Empty;

    public string EstimatedGuests { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;
}
