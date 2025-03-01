using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.request.Actor
{
    public class UpdateActorRequestDTO
    {
        [Required(ErrorMessage = "ActorId is required.")]
        public int ActorId { get; set; }

        public string? FullName { get; set; }

        public string? Bio { get; set; }

        public DateTime? BirthDate { get; set; }

        public IFormFile? Image { get; set; }
    }
}
