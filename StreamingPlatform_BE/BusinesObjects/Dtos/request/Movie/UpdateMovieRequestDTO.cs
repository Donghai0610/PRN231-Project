﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.request.Movie
{
    public class UpdateMovieRequestDTO
    {
        public int MovieId { get; set; }
        public string MovieName { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string LinkPhim { get; set; }
        public bool isActive { get; set; }
        public IFormFile Image { get; set; }
        public List<int> ActorIds { get; set; }
        public List<int> GenreIds { get; set; }
    }
}
