using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response.Comment
{
    public class CommentResponseDTO
    {
        public int CommentId { get; set; }
        public string Content { get; set; }
        public DateTime DatePosted { get; set; }
        public int MovieId { get; set; }
        public int AppUserId { get; set; }
    }
}
