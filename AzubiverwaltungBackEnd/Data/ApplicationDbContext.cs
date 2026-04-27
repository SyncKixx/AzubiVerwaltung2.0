using Microsoft.EntityFrameworkCore;
using AzubiVerwaltungBackEnd.Models;

namespace AzubiVerwaltungBackEnd.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        
        public DbSet<Azubi> Azubis { get; set; }
        public DbSet<Dienst> Dienste { get; set; }
        public DbSet<Zuweisung> Zuweisung { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Azubi>().ToTable("Azubis");
            modelBuilder.Entity<Dienst>().ToTable("Dienste");
            modelBuilder.Entity<Zuweisung>().ToTable("Zuweisung");

            modelBuilder.Entity<Azubi>().HasData(new Azubi
            {
                UserId = 1,
                FirstName = "Robin",
                LastName = "Grubendorfer",
                Email = "rgrubendorfer@hansalog.de",
                passwordhash = "$2a$11$8zvOyuIaoqUrs5/RB.5oXOgv35fTm7HVuuA6GvUV4MfAs3V8qZcMC",
                AdminRights = true,
                CreatedAt = new DateTime(2024, 1, 1)
            });
        }
    }
}
