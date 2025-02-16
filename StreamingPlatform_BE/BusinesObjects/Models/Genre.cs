using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Genre
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GenreId { get; set; }
        public string Name { get; set; }  // Tên thể loại (ví dụ: "Hành động", "Kinh dị", "Tình cảm")
        public ICollection<MovieGenre> MovieGenres { get; set; }
    }
}
