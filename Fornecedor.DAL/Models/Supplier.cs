﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace Fornecedor.DAL.Models
{
    public class Supplier : BaseModel
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string CpfCnpj { get; set; }
        [Required]
        public DateTime CreationTime { get; set; }
        [Required]
        public List<string> TelephoneList
        {
            get
            {
                return this.Telephones.Split(',').ToList();
            }
            set
            {
                this.Telephones = String.Join(",", value);
            }
        }
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string Telephones { get; set; }
        public string Rg { get; set; }
        public DateTime? BirthDate { get; set; }
        [Required]
        public Company Company { get; set; }
    }
}
