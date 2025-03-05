using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.request.Blog
{
    public class BlogRequestDTO
    {
        public string Title { get; set; }
        public IFormFile Content { get; set; }  // Nội dung bài viết sẽ được lưu trên Cloudinary
        public int? MovieId { get; set; }

        public string AppUserId { get; set; }
    }
}
