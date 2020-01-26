using System;
using System.Collections.Generic;
using System.Text;

namespace Fornecedor.DAL.Models
{
    public class Company : BaseModel
    {
        public Guid Id { get; set; }
        public string Uf { get; set; }
        public string TradeName { get; set; }
        public string Cnpj { get; set; }
    }
}
