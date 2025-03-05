using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response.Actor
{
    public class ActorMovieResponseDTO
    {
        public int MovieId { get; set; }
        public string MovieName { get; set; }
        public string? Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public bool isActive { get; set; }
        public string Image { get; set; }

        public string MovieUrl { get; set; }

    }
}
