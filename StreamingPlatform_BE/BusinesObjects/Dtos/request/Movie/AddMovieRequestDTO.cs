using Azure.Messaging;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.request.Movie
{
    public class AddMovieRequestDTO
    {
        public string MovieName { get; set; }
        public string? Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public bool isActive { get; set; }
        [Required(ErrorMessage ="The Images can not empty")]
        public IFormFile Image { get; set; }
        public string MovieUrl { get; set; }
        public List<int> ActorIds { get; set; }
        public List<int> GenreIds { get; set; }

    }
}
