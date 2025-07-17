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

// Database configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Add services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IHouseService, HouseService>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["JWT_ISSUER"],
            ValidAudience = configuration["JWT_AUDIENCE"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["JWT_SECRET"] ?? 
                    throw new InvalidOperationException("JWT_SECRET not found")))
        };
    });

builder.Services.AddAuthorization();

// Update CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowedOrigins", policy =>
    {
        var origins = configuration["ALLOWED_ORIGINS"]?.Split(',') ?? 
            new[] { "http://localhost:4200" };
        policy.WithOrigins(origins)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Add Swagger support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add logging
builder.Logging.AddConsole();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Create database and seed if needed
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var dbContext = services.GetRequiredService<AppDbContext>();

    try
    {
        dbContext.Database.EnsureCreated();

        // Seed some data if table is empty
        if (!dbContext.Users.Any())
        {
            var passwordHash = Convert.ToBase64String(
                System.Security.Cryptography.SHA256.Create().ComputeHash(
                    Encoding.UTF8.GetBytes("password123")
                )
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
            var users = await dbContext.Users.ToListAsync();
            logger.LogInformation("Existing users in database: {Count}", users.Count);
            foreach (var user in users)
            {
                logger.LogInformation("User ID: {UserId}, Email: {Email}", user.Id, user.Email);
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding the database");
        throw;
    }
}

app.Run();
