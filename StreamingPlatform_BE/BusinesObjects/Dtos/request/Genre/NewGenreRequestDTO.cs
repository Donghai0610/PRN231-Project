using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.request.Genre
{
    public class NewGenreRequestDTO
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }
    }
}
