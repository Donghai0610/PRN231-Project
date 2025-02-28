using BusinesObjects.Dtos.response.Actor;
using BusinesObjects.Dtos.response.Comment;
using BusinesObjects.Dtos.response.Genre;
using BusinesObjects.Dtos.response.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response.Movie
{
    public class MovieResponseDTO
    {
        public int MovieId { get; set; }
        public string MovieName { get; set; }
        public string? Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public bool isActive { get; set; }
        public string Image { get; set; }

        public string MovieUrl { get; set; }
        public List<ActorResponseDTO> Actors { get; set; }
        public List<GenreResponseDTO> Genres { get; set; }

        public List<CommentResponseDTO> Comments { get; set; }

        public List<ReviewResponseDTO> Reviews { get; set; }


    }
}
