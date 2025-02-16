using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public string Content { get; set; }  // Nội dung bình luận
        public DateTime DatePosted { get; set; } = DateTime.Now;  // Thời gian bình luận

        // Mối quan hệ với Movie
        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        // Mối quan hệ với AppUser (người dùng)
        public string AppUserId { get; set; }  // Khóa ngoại đến AppUser (IdentityUser)
        public AppUser AppUser { get; set; }
    }
}
