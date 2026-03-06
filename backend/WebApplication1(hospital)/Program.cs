using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using WebApplication1_hospital_.Models;

var builder = WebApplication.CreateBuilder(args);

// Bind to PORT env var (Railway sets this automatically)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// CORS — origins are configured in appsettings.json or env vars
// In Railway: set  AllowedOrigins__0 = https://your-app.netlify.app
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>()
    ?? new[] { "http://localhost:4200" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext (MySQL – Database First)
// Connection string comes from appsettings.json or
// Railway env var: ConnectionStrings__DefaultConnection
builder.Services.AddDbContext<HospitalContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("DefaultConnection")!
    )
);

var app = builder.Build();

// Swagger — enabled in all environments so you can test after deploy
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAngular");
// HTTPS redirect is handled by the host/proxy in production — not needed here
// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();