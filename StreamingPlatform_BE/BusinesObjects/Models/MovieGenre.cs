using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class MovieGenre
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  // Cấu hình Identity nếu cần
        public int MovieGenreId { get; set; }

        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}
