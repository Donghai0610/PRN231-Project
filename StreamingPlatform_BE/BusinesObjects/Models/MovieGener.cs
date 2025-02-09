using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class MovieGener
    {
        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        public int GenerId { get; set; }
        public Gener Gener { get; set; }
    }
}
