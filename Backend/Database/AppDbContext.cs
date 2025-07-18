using Microsoft.EntityFrameworkCore;
using Backend.Database.Models;
using System.Text.Json;

namespace Backend.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<House> Houses { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<House>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Area).IsRequired().HasMaxLength(100);
                entity.Property(e => e.City).IsRequired().HasMaxLength(100);
                
                // Configure JSON columns
                entity.Property(e => e.Amenities)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null));

                entity.Property(e => e.AdditionalImages)
                    .HasConversion(
                        v => string.Join(";", v),
                        v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList()
                    );

        entity.Property<bool>("IsDeleted")
            .HasDefaultValue(false);

        entity.Property<DateTime?>("DeletedAt");

        // Add global query filter for soft delete
        entity.HasQueryFilter(h => !EF.Property<bool>(h, "IsDeleted"));
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).HasMaxLength(50);

                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure global query filter for soft delete
            modelBuilder.Entity<House>()
                .HasQueryFilter(h => !h.IsDeleted);
        }

        // Add method for soft delete
public override int SaveChanges()
{
    UpdateSoftDeleteStatuses();
    return base.SaveChanges();
}

public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
{
    UpdateSoftDeleteStatuses();
    return base.SaveChangesAsync(cancellationToken);
}

private void UpdateSoftDeleteStatuses()
{
    foreach (var entry in ChangeTracker.Entries())
    {
        if (entry.Entity is House)
        {
            switch (entry.State)
            {
                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.CurrentValues["IsDeleted"] = true;
                    entry.CurrentValues["DeletedAt"] = DateTime.UtcNow;
                    break;
            }
        }
    }
}
    }
}
