using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response.Review
{
    public class ReviewResponseDTO
    {
        public int ReviewId { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
        public DateTime DatePosted { get; set; }
        public int MovieId { get; set; }
        public int AppUserId { get; set; }
    }
}
