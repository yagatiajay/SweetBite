using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SweetBite.API.Data;
using SweetBite.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure SQLite Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=sweetbite.db";
builder.Services.AddDbContext<SweetBiteDbContext>(options =>
    options.UseSqlite(connectionString));

// 2. Register Email Notification Service
builder.Services.AddSingleton<EmailNotificationService>();

// 3. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 4. Configure Controllers & JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 5. OpenAPI / Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Sweet Bite Bakery API", Version = "v1", Description = "Artisan Bakery & Patisserie API with Admin Management for Sweet Bite" });
});

var app = builder.Build();

// Automatically ensure DB is created & seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SweetBiteDbContext>();
    DbInitializer.Initialize(context);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sweet Bite API v1"));
}

app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
