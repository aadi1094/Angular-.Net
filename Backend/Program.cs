using System.Text;
using Backend.Database;
using Backend.Database.Models;
using Backend.Database.Repositories;
using Backend.Services;
using Backend.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var configuration = ConfigurationHelper.LoadConfiguration();

// Database configuration
var connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
    $"Server={configuration["DB_HOST"]};" +
    $"Port={configuration["DB_PORT"]};" +
    $"Database={configuration["DB_NAME"]};" +
    $"User={configuration["DB_USER"]};" +
    $"Password={configuration["DB_PASSWORD"]};";

// Update CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials()
               .WithExposedHeaders("Authorization"));
});

// Register services
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Register all services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IHouseService, HouseService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = configuration.GetSection("JwtSettings");
    var key = Encoding.UTF8.GetBytes(
        jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
    
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Update middleware order
app.UseRouting();

// Add CORS middleware before Authentication but after Routing
app.UseCors("AllowOrigin");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers(); // This should work now

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var dbContext = services.GetRequiredService<AppDbContext>();

    try
    {
        // Ensure database and tables are created
        await dbContext.Database.EnsureCreatedAsync();
        logger.LogInformation("Database and tables created successfully");

        // Seed initial data if needed
        if (!await dbContext.Users.AnyAsync())
        {
            logger.LogInformation("Seeding default user...");
            var passwordHash = Convert.ToBase64String(
                System.Security.Cryptography.SHA256.Create()
                    .ComputeHash(Encoding.UTF8.GetBytes("password123"))
            );
            
            var user = new User 
            { 
                Name = "John Doe", 
                Email = "john@example.com", 
                PasswordHash = passwordHash,
                Role = "Admin" 
            };

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
            logger.LogInformation("Default user created with ID: {UserId}", user.Id);
        }
        else
        {
            logger.LogInformation("Users table already has data. Skipping seed.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database");
    }
}

app.Run();
           



