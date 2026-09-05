using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBite.API.Data;
using SweetBite.API.DTOs;
using SweetBite.API.Models;
using SweetBite.API.Services;

namespace SweetBite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly SweetBiteDbContext _context;
    private readonly EmailNotificationService _emailService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        SweetBiteDbContext context,
        EmailNotificationService emailService,
        ILogger<OrdersController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid || dto.Items.Count == 0)
        {
            return BadRequest(new { message = "Order must contain at least one item." });
        }

        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        decimal total = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in dto.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
            {
                return BadRequest(new { message = $"Product with ID {item.ProductId} not found." });
            }

            var qty = Math.Max(1, item.Quantity);

            // Decrement stock
            product.StockQuantity = Math.Max(0, product.StockQuantity - qty);
            if (product.StockQuantity == 0)
            {
                product.IsSoldOut = true;
            }

            var itemTotal = product.Price * qty;
            total += itemTotal;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Quantity = qty,
                UnitPrice = product.Price
            });
        }

        var reference = $"SB-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

        var order = new Order
        {
            OrderReference = reference,
            UserId = dto.UserId,
            CustomerName = dto.CustomerName,
            CustomerEmail = dto.CustomerEmail.Trim().ToLower(),
            CustomerPhone = dto.CustomerPhone,
            DeliveryType = dto.DeliveryType,
            DeliveryAddress = dto.DeliveryAddress,
            DeliveryDate = dto.DeliveryDate,
            SpecialNotes = dto.SpecialNotes,
            PaymentMethod = dto.PaymentMethod ?? "Card",
            PaymentStatus = dto.PaymentStatus ?? "Paid",
            TotalAmount = total,
            Status = "Confirmed",
            CreatedAt = DateTime.UtcNow,
            Items = orderItems
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Dispatch Email Notification to Bakery Owner (yagatiajay2@gmail.com)
        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendOrderNotificationAsync(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order notification email for order {OrderRef}", order.OrderReference);
            }
        });

        return CreatedAtAction(nameof(GetOrderByReference), new { reference = order.OrderReference }, order);
    }

    [HttpGet("{reference}")]
    public async Task<ActionResult<Order>> GetOrderByReference(string reference)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderReference.ToLower() == reference.ToLower());

        if (order == null) return NotFound(new { message = "Order not found." });
        return Ok(order);
    }

    [HttpGet("user/{email}")]
    public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(string email)
    {
        var emailLower = email.Trim().ToLower();
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.CustomerEmail == emailLower)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    // --- Admin Endpoints ---

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<Order>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound(new { message = "Order not found." });

        order.Status = dto.Status.Trim();
        await _context.SaveChangesAsync();

        return Ok(order);
    }

    [HttpPost("test-email")]
    public async Task<ActionResult> TestEmailNotification([FromQuery] string? email)
    {
        var target = string.IsNullOrWhiteSpace(email) ? _emailService.AdminEmail : email;
        var sent = await _emailService.SendTestEmailAsync(target);

        return Ok(new
        {
            success = sent,
            recipient = target,
            message = $"Test order notification processed for {target}."
        });
    }
}
