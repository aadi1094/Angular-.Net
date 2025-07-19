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

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Role).HasMaxLength(50);
            });

            // Configure House entity
            modelBuilder.Entity<House>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AdditionalImages)
                      .HasConversion(
                          v => string.Join(";", v ?? new List<string>()),
                          v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList()
                      );
                entity.Property(e => e.Amenities)
                      .HasConversion(
                          v => string.Join(";", v ?? new List<string>()),
                          v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList()
                      );
                entity.HasQueryFilter(h => !h.IsDeleted);
            });
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

