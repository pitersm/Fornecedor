using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Fornecedor.Service.DTO
{
    public class CompanyDTO : BaseDTO
    {
        public string Uf { get; set; }
        public string TradeName { get; set; }
        public string Cnpj { get; set; }
    }
}
