using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos
{
    public class UrlQueryParameters
    {
        // Trang hiện tại (mặc định là 1)
        public int Page { get; set; } = 1;

        // Kích thước trang (mặc định là 10)
        public int PageSize { get; set; } = 10;

        // Từ khóa tìm kiếm (có thể là null)
        public string? Search { get; set; }
    }
}
