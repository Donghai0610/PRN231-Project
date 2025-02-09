using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime IssueDate { get; set; }
        public bool IsPaid { get; set; }
        public int PaymentId { get; set; }
        public Payment Payment { get; set; }
    }
}
