using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Movie
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MovieId { get; set; }
        public string MovieName { get; set; }
        public string? Description { get; set; }
        public DateTime ReleaseDate { get; set; } = DateTime.Now;
        public string? Image { get; set; }

        public string MovieUrl { get; set; }
        public bool isActive { get; set; } = false;

        // Quan hệ nhiều-nhiều với Genre thông qua MovieGenre
        public ICollection<MovieGenre> MovieGenres { get; set; }

        // Quan hệ với Actor
        public ICollection<MovieActor> MovieActors { get; set; }

        // Quan hệ với Comment
        public ICollection<Comment> Comments { get; set; }

        // Quan hệ với Review
        public ICollection<Review> Reviews { get; set; }

        // Quan hệ với Blog
        public ICollection<Blog> Blogs { get; set; }
    }
}
