using BusinesObjects.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) :base(dbContextOptions)
        {
            
        }

        public DbSet<Actor> Actors { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<MovieActor> MovieActors { get; set; }
        public DbSet<MovieGenre> MovieGenres { get; set; }  // Đảm bảo DbSet cho MovieGenre
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Blog> Blogs { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var builder = new ConfigurationBuilder()
                               .SetBasePath(Directory.GetCurrentDirectory())
                               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                
                new IdentityRole
                {
                    Name = "Customer",
                    NormalizedName = "CUSTOMER"
                }
            };
            builder.Entity<Actor>()
                .Property(a => a.Image)
                .HasColumnType("text");
            builder.Entity<Movie>()
                .Property(m => m.Image)
                .HasColumnType("text");

            // Quan hệ nhiều nhiều giữa Actor và Movie
            builder.Entity<MovieActor>()
                .HasKey(ma => new { ma.MovieId, ma.ActorId });

            builder.Entity<MovieActor>()
                .HasOne(ma => ma.Movie)
                .WithMany(m => m.MovieActors)
                .HasForeignKey(ma => ma.MovieId);

            builder.Entity<MovieActor>()
                .HasOne(ma => ma.Actor)
                .WithMany(a => a.MovieActors)
                .HasForeignKey(ma => ma.ActorId);

            // Quan hệ nhiều nhiều giữa Genre và Movie
            builder.Entity<MovieGenre>()
                .HasKey(mg => new { mg.MovieId, mg.GenreId });

            builder.Entity<MovieGenre>()
                .HasOne(mg => mg.Movie)
                .WithMany(m => m.MovieGenres)
                .HasForeignKey(mg => mg.MovieId);

            builder.Entity<MovieGenre>()
                .HasOne(mg => mg.Genre)
                .WithMany(g => g.MovieGenres)
                .HasForeignKey(mg => mg.GenreId);

            // Quan hệ one-to-many giữa Movie và Comment
            builder.Entity<Comment>()
                .HasOne(c => c.Movie)
                .WithMany(m => m.Comments)
                .HasForeignKey(c => c.MovieId);

            // Quan hệ one-to-one giữa AppUser và Comment
            builder.Entity<Comment>()
                .HasOne(c => c.AppUser)
                .WithOne(u => u.Comment)
                .HasForeignKey<Comment>(c => c.AppUserId);

            // Quan hệ one-to-many giữa Movie và Review
            builder.Entity<Review>()
                .HasOne(r => r.Movie)
                .WithMany(m => m.Reviews)
                .HasForeignKey(r => r.MovieId);

            // Quan hệ one-to-many giữa AppUser và Review
            builder.Entity<Review>()
                .HasOne(r => r.AppUser)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.AppUserId);

            // Quan hệ one-to-many giữa Movie và Blog
            builder.Entity<Blog>()
                .HasOne(b => b.Movie)
                .WithMany(m => m.Blogs)
                .HasForeignKey(b => b.MovieId)
                .OnDelete(DeleteBehavior.SetNull);

            // Quan hệ one-to-many giữa AppUser và Blog
            builder.Entity<Blog>()
                .HasOne(b => b.AppUser)
                .WithMany(u => u.Blogs)
                .HasForeignKey(b => b.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
