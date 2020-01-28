using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Fornecedor.Service.DTO
{
    public class SupplierDTO : BaseDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string CpfCnpj { get; set; }
        [Required]
        public DateTime CreationTime { get; set; }
        [Required]
        public List<string> TelephoneList { get; set; }
        public string Rg { get; set; }
        public DateTime BirthDate { get; set; }
        public Guid CompanyId { get; set; }
        public CompanyDTO Company { get; set; }
    }
}
