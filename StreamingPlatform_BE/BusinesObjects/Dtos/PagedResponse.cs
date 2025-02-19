using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos
{
    public class PagedResponse<T>
    {
        public List<T> Data { get; set; }

        // Tổng số trang
        public int TotalPages { get; set; }

        // Trang hiện tại
        public int Page { get; set; }

        // Kích thước trang
        public int PageSize { get; set; }

        // Tổng số mục
        public int TotalItems { get; set; }

        // Constructor để khởi tạo các giá trị cho PagedResponse
        public PagedResponse(List<T> data, int totalPages, int page, int pageSize, int totalItems)
        {
            Data = data;
            TotalPages = totalPages;
            Page = page;
            PageSize = pageSize;
            TotalItems = totalItems;
        }
    }
}
