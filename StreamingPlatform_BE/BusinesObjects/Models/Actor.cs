using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Actor
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Bio { get; set; }
        public DateTime BirthDate { get; set; }
        public string Image { get; set; }

        // Mối quan hệ nhiều-nhiều với Movie
        public List<MovieActor> MovieActors { get; set; }
    }
}
