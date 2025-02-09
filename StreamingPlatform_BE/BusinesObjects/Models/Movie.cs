using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Genre { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Image { get; set; }
        public double Rating { get; set; }

        // Mối quan hệ với diễn viên
        public List<MovieActor> MovieActors { get; set; }

        // Mối quan hệ với thể loại
        public List<MovieGener> MovieCategories { get; set; }

        // Mối quan hệ với blog review
        public List<BlogReview> BlogReviews { get; set; }

        // Mối quan hệ với lịch sử xem phim
        public List<WatchHistory> WatchHistories { get; set; }

        // Mối quan hệ với bình luận
        public List<Comment> Comments { get; set; }
    }
}
