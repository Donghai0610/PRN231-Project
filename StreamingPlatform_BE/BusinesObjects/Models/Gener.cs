using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Gener
    {
        public int Id { get; set; }
        public string Name { get; set; }  // Tên thể loại (ví dụ: "Hành động", "Kinh dị", "Tình cảm")

        // Mối quan hệ nhiều-nhiều với Movie
        public List<MovieGener> MovieCategories { get; set; }
    }
}
