using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response.Movie
{
    public class MovieActorResponseDTO
    {
        public int ActorId { get; set; }
        public string FullName { get; set; }
        public string? Bio { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Image { get; set; }
    }
}
