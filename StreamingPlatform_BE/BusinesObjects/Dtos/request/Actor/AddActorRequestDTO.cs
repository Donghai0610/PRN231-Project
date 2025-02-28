using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.request.Actor
{
    public class AddActorRequestDTO
    {
        [Required(ErrorMessage = "Full Name is required.")]
        public string FullName { get; set; }

        public string? Bio { get; set; }

        [Required(ErrorMessage = "Birth Date is required.")]
        public DateTime BirthDate { get; set; }

        [Required]
        public IFormFile Image { get; set; }
    }
}
