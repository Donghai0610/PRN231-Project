using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewId { get; set; }

        public string Content { get; set; }
        public int Rating { get; set; }
        public DateTime DatePosted { get; set; }

        // Quan hệ với Movie
        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        // Quan hệ với AppUser
        public string AppUserId { get; set; }  // Khóa ngoại đến AppUser (IdentityUser)
        public AppUser AppUser { get; set; }
    }
}
