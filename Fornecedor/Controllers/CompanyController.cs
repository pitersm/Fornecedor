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
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _CompanyService;
        public CompanyController(ICompanyService CompanyService)
        {
            _CompanyService = CompanyService;
        }

        // GET: api/Book
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var values = await _CompanyService.List();

            return Ok(values);
        }

        [HttpGet("cnpj/{cnpj}")]
        public async Task<IActionResult> CnpjExists(string cnpj)
        {
            bool exists = await _CompanyService.CnpjExists(cnpj);

            return Ok(exists);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var value = await _CompanyService.Get(id);

            return Ok(value);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<IActionResult> Post(CompanyDTO value)
        {
            var newCompany = await _CompanyService.Create(value);

            return Ok(newCompany);
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task Put(CompanyDTO value)
        {
            await _CompanyService.Update(value);
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _CompanyService.Delete(id);
        }
    }
}