using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BusinesObjects.Dtos.request.Movie
{
    public class UpdateMovieRequestDTO
    {
        // Nếu MovieId là trường bắt buộc, bỏ dấu ? và thêm [Required]
        [Required(ErrorMessage = "MovieId is required.")]
        public int MovieId { get; set; }

        // Nếu MovieName là trường bắt buộc, bỏ dấu ? và thêm [Required]
        public string? MovieName { get; set; }

        // Nếu Description là trường bắt buộc, bỏ dấu ? và thêm [Required]
        public string? Description { get; set; }

        // ReleaseDate có thể nullable (không bắt buộc gửi)
        public DateTime ReleaseDate { get; set; }

        // MovieUrl có thể nullable
        public string? MovieUrl { get; set; }

        // Nếu muốn Image là trường bắt buộc, bỏ dấu ? và thêm [Required]
        public IFormFile?Image { get; set; }

        // Nếu ActorIds và GenreIds có thể null
        public List<int>? ActorIds { get; set; }

        public List<int>? GenreIds { get; set; }

        // isActive không bắt buộc
        public bool? isActive { get; set; }
    }
}
