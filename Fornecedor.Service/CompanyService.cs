using AutoMapper;
using Fornecedor.DAL.Models;
using Fornecedor.DAL.Repository;
using Fornecedor.Service.DTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Fornecedor.Service
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _repository;
        private readonly IMapper _mapper;

        public CompanyService(ICompanyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public Task<bool> CnpjExists(string cnpj)
        {
            return _repository.CnpjExists(cnpj);
        }

        public async Task<CompanyDTO> Create(CompanyDTO dto)
        {
            await ValidateCompany(dto);

            var newBook = await _repository.Save(_mapper.Map<Company>(dto));
            return _mapper.Map<CompanyDTO>(newBook);
        }

        public async Task Delete(Guid id)
        {
            await _repository.Delete(id);
        }

        public async Task<CompanyDTO> Get(Guid id)
        {
            return _mapper.Map<CompanyDTO>(await _repository.Get(id));
        }

        public Task<List<CompanyDTO>> List()
        {
            return _repository.List()
                              .OrderBy(a => a.TradeName)
                              .Select(a => _mapper.Map<CompanyDTO>(a))
                              .ToListAsync();
        }

        public async Task Update(CompanyDTO dto)
        {
            //await ValidateCompany(dto, true);

            var repoObj = _mapper.Map<Company>(dto);
            await _repository.Update(repoObj);
        }

        public async Task ValidateCompany(CompanyDTO dto, bool isUpdate = false)
        {
            ValidationService.ValidateCnpj(dto.Cnpj);

            if (isUpdate)
            {
                var previousCnpj = await _repository.GetCnpj((Guid)dto.Id);
                
                if (previousCnpj == dto.Cnpj)
                {
                    return;
                }
            }

            var cnpjExists = await CnpjExists(dto.Cnpj);
            if (cnpjExists)
            {
                throw new Exception("This Cpf/Cnpj already exists.");
            }
        }


    }
}
