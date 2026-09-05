namespace SweetBite.API.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderReference { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public User? User { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string DeliveryType { get; set; } = "Delivery"; // Delivery | Bakery Pickup
    public string DeliveryAddress { get; set; } = string.Empty;
    public string DeliveryDate { get; set; } = string.Empty;
    public string SpecialNotes { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "Card"; // Card | ApplePay | PayOnDelivery
    public string PaymentStatus { get; set; } = "Paid"; // Paid | Pending
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Confirmed"; // Confirmed | Baking | Ready | Delivered
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
}
