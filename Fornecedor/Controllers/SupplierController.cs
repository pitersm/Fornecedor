using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fornecedor.Service;
using Fornecedor.Service.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Fornecedor.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;
        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        // GET: api/Book
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var values = await _supplierService.List();

            return Ok(values);
        }

        [HttpGet("cnpj/{cnpj}")]
        public async Task<IActionResult> CpfCnpjExists(string cpfCnpj)
        {
            bool exists = await _supplierService.CpfCnpjExists(cpfCnpj);

            return Ok(exists);
        }

        [HttpGet("rg/{rg}")]
        public async Task<IActionResult> RgExists(string rg)
        {
            bool exists = await _supplierService.RgExists(rg);

            return Ok(exists);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var value = await _supplierService.Get(id);

            return Ok(value);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<IActionResult> Post(SupplierDTO value)
        {
            var newSupplier = await _supplierService.Create(value);

            return Ok(newSupplier);
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task Put(SupplierDTO value)
        {
            await _supplierService.Update(value);
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _supplierService.Delete(id);
        }
    }
}