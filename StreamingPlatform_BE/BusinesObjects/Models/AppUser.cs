using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class AppUser :IdentityUser
    {

        public string Image { get; set; } = string.Empty; 
        public bool isActive { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;


        // Quan hệ với Comment (One-to-One)
        public Comment Comment { get; set; }

        // Quan hệ với Review (One-to-Many)
        public ICollection<Review> Reviews { get; set; }

        // Quan hệ với Blog (One-to-Many)
        public ICollection<Blog> Blogs { get; set; }



    }
}
