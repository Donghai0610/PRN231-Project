using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response
{
    public class ResponseApiDTO<T>
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public ResponseApiDTO(string status, string message, T data)
        {
            Status = status;
            Message = message;
            Data = data;
        }
    }
}
