using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response
{
    public class LoginResponseDTO
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Token { get; set; }
    }
}
