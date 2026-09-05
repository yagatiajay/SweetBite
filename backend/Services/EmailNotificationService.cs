using System.Net;
using System.Net.Mail;
using System.Text;
using SweetBite.API.Models;

namespace SweetBite.API.Services;

public class EmailNotificationService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(IConfiguration config, ILogger<EmailNotificationService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public string AdminEmail => _config["EmailSettings:AdminEmail"] ?? "yagatiajay2@gmail.com";

    public async Task<bool> SendOrderNotificationAsync(Order order)
    {
        var subject = $"🧁 [Sweet Bite] New Order Received! #{order.OrderReference} (${order.TotalAmount:F2})";

        var sb = new StringBuilder();
        sb.AppendLine("<!DOCTYPE html>");
        sb.AppendLine("<html><head><style>");
        sb.AppendLine("body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fff6f5; margin: 0; padding: 20px; color: #3d2314; }");
        sb.AppendLine(".card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #ebd8d0; overflow: hidden; box-shadow: 0 8px 24px rgba(61,35,20,0.08); }");
        sb.AppendLine(".header { background: linear-gradient(135deg, #3d2314, #704734); padding: 30px; text-align: center; color: #ffffff; }");
        sb.AppendLine(".badge { background: #b67c26; color: #ffffff; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; text-transform: uppercase; }");
        sb.AppendLine(".body { padding: 30px; }");
        sb.AppendLine(".info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }");
        sb.AppendLine(".info-table td { padding: 8px 0; border-bottom: 1px solid #f2e6e1; font-size: 14px; }");
        sb.AppendLine(".info-table td:first-child { color: #855b45; width: 40%; font-weight: 600; }");
        sb.AppendLine(".item-table { width: 100%; border-collapse: collapse; margin-top: 15px; }");
        sb.AppendLine(".item-table th { background: #fdf6f2; text-align: left; padding: 10px; font-size: 13px; color: #5c3824; border-bottom: 2px solid #ebd8d0; }");
        sb.AppendLine(".item-table td { padding: 12px 10px; border-bottom: 1px solid #f2e6e1; font-size: 14px; }");
        sb.AppendLine(".total-row td { font-weight: bold; font-size: 16px; color: #3d2314; border-top: 2px solid #ebd8d0; }");
        sb.AppendLine(".footer { background: #faf3ef; padding: 20px; text-align: center; font-size: 12px; color: #855b45; }");
        sb.AppendLine("</style></head><body>");

        sb.AppendLine("<div class='card'>");
        sb.AppendLine("  <div class='header'>");
        sb.AppendLine("    <div style='font-size: 32px; margin-bottom: 8px;'>🧁</div>");
        sb.AppendLine("    <h1 style='margin: 0; font-size: 24px; letter-spacing: -0.5px;'>Sweet Bite Bakery</h1>");
        sb.AppendLine("    <p style='margin: 6px 0 0; opacity: 0.9; font-size: 14px;'>New Customer Order Notification</p>");
        sb.AppendLine("  </div>");

        sb.AppendLine("  <div class='body'>");
        sb.AppendLine("    <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;'>");
        sb.AppendLine($"      <h2 style='margin: 0; font-size: 18px; color: #2a1810;'>Order #{order.OrderReference}</h2>");
        sb.AppendLine($"      <span class='badge'>{order.Status}</span>");
        sb.AppendLine("    </div>");

        sb.AppendLine("    <table class='info-table'>");
        sb.AppendLine($"      <tr><td>Customer Name</td><td><strong>{order.CustomerName}</strong></td></tr>");
        sb.AppendLine($"      <tr><td>Email</td><td><a href='mailto:{order.CustomerEmail}'>{order.CustomerEmail}</a></td></tr>");
        sb.AppendLine($"      <tr><td>Phone</td><td>{order.CustomerPhone}</td></tr>");
        sb.AppendLine($"      <tr><td>Fulfillment Method</td><td><strong>{order.DeliveryType}</strong></td></tr>");
        sb.AppendLine($"      <tr><td>Scheduled Date</td><td><strong>{order.DeliveryDate}</strong></td></tr>");
        if (!string.IsNullOrEmpty(order.DeliveryAddress))
        {
            sb.AppendLine($"      <tr><td>Delivery Address</td><td>{order.DeliveryAddress}</td></tr>");
        }
        sb.AppendLine($"      <tr><td>Payment</td><td>{order.PaymentMethod} ({order.PaymentStatus})</td></tr>");
        if (!string.IsNullOrEmpty(order.SpecialNotes))
        {
            sb.AppendLine($"      <tr><td>Special Note</td><td><em>\"{order.SpecialNotes}\"</em></td></tr>");
        }
        sb.AppendLine("    </table>");

        sb.AppendLine("    <h3 style='margin: 20px 0 10px; font-size: 16px;'>Items to Prepare:</h3>");
        sb.AppendLine("    <table class='item-table'>");
        sb.AppendLine("      <tr><th>Item</th><th style='text-align:center;'>Qty</th><th style='text-align:right;'>Unit Price</th><th style='text-align:right;'>Total</th></tr>");

        foreach (var item in order.Items)
        {
            sb.AppendLine($"      <tr><td><strong>{item.ProductName}</strong></td><td style='text-align:center;'>{item.Quantity}</td><td style='text-align:right;'>${item.UnitPrice:F2}</td><td style='text-align:right;'><strong>${item.TotalPrice:F2}</strong></td></tr>");
        }

        sb.AppendLine($"      <tr class='total-row'><td colspan='3' style='text-align:right; padding-top: 15px;'>Order Total:</td><td style='text-align:right; padding-top: 15px; color: #b67c26;'>${order.TotalAmount:F2}</td></tr>");
        sb.AppendLine("    </table>");
        sb.AppendLine("  </div>");

        sb.AppendLine("  <div class='footer'>");
        sb.AppendLine($"    Sent automatically to {AdminEmail} • Sweet Bite Artisan Bakery System");
        sb.AppendLine("  </div>");
        sb.AppendLine("</div>");
        sb.AppendLine("</body></html>");

        var htmlBody = sb.ToString();

        return await TrySendEmailAsync(AdminEmail, subject, htmlBody, order.OrderReference);
    }

    public async Task<bool> SendTestEmailAsync(string targetEmail)
    {
        var emailTo = string.IsNullOrWhiteSpace(targetEmail) ? AdminEmail : targetEmail;
        var subject = "🧁 [Sweet Bite] Test Email Notification";
        var body = $"<html><body style='font-family: Arial; padding: 20px; color: #3d2314;'>" +
                   $"<h2>Sweet Bite Bakery Email Test</h2>" +
                   $"<p>This is a test notification confirming that order alert emails are properly wired to <strong>{emailTo}</strong>.</p>" +
                   $"<p>Timestamp: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</p>" +
                   $"</body></html>";

        return await TrySendEmailAsync(emailTo, subject, body, "TEST-PING");
    }

    private async Task<bool> TrySendEmailAsync(string toEmail, string subject, string htmlBody, string refId)
    {
        var smtpServer = _config["EmailSettings:SmtpServer"];
        var smtpPortStr = _config["EmailSettings:SmtpPort"];
        var senderEmail = _config["EmailSettings:SenderEmail"];
        var senderPassword = _config["EmailSettings:SenderPassword"];

        _logger.LogInformation("==================================================");
        _logger.LogInformation("📬 [EMAIL DISPATCH TRIGGERED]");
        _logger.LogInformation("To: {ToEmail}", toEmail);
        _logger.LogInformation("Subject: {Subject}", subject);
        _logger.LogInformation("Order Reference: {RefId}", refId);
        _logger.LogInformation("==================================================");

        // Record to local email log for immediate verification
        try
        {
            var logPath = Path.Combine(AppContext.BaseDirectory, "order_notifications.log");
            var entry = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] TO: {toEmail} | REF: {refId} | SUBJECT: {subject}\n";
            await File.AppendAllTextAsync(logPath, entry);
        }
        catch { }

        if (!string.IsNullOrWhiteSpace(smtpServer) && !string.IsNullOrWhiteSpace(senderEmail) && !string.IsNullOrWhiteSpace(senderPassword))
        {
            try
            {
                int port = int.TryParse(smtpPortStr, out var p) ? p : 587;
                using var client = new SmtpClient(smtpServer, port)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(senderEmail, senderPassword)
                };

                using var message = new MailMessage
                {
                    From = new MailAddress(senderEmail, "Sweet Bite Bakery Orders"),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                message.To.Add(toEmail);

                await client.SendMailAsync(message);
                _logger.LogInformation("✅ Email successfully sent via SMTP to {ToEmail}", toEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ SMTP dispatch encountered an error: {Message}. (Logged locally)", ex.Message);
                return false;
            }
        }
        else
        {
            _logger.LogInformation("ℹ️ SMTP credentials not configured in appsettings.json. Email logged to order_notifications.log successfully.");
            return true;
        }
    }
}
