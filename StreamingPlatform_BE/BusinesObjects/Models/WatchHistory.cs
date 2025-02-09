using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class WatchHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public DateTime WatchedAt { get; set; }

        public AppUser User { get; set; }
        public Movie Movie { get; set; }
    }
}
