using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Dtos.response.User
{
    public class UserWithRolesDTO
    {
        public string Id { get; set; }          
        public string UserName { get; set; }     
        public string Email { get; set; }       
        public List<string> Roles { get; set; }  
        public bool isActive { get; set; }       
        public DateTime CreatedAt { get; set; }  
    }
}
