using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class AppUser :IdentityUser
    {

        public string Image { get; set; } = string.Empty; 
        public bool isActive { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}
