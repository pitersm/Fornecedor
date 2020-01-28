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

namespace Fornecedor.Service
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _repository;
        private readonly ICompanyService _companyService;
        private readonly IMapper _mapper;

        public SupplierService(ISupplierRepository repository, IMapper mapper, ICompanyService companyService)
        {
            _repository = repository;
            _mapper = mapper;
            _companyService = companyService;
        }

        public Task<bool> CpfCnpjExists(string cpfCnpj)
        {
            return _repository.CpfCnpjExists(cpfCnpj);
        }

        public async Task<SupplierDTO> Create(SupplierDTO dto)
        {
            await ValidateSupplier(dto);

            var newBook = await _repository.Save(_mapper.Map<Supplier>(dto));
            return _mapper.Map<SupplierDTO>(newBook);
        }

        public async Task Delete(Guid id)
        {
            await _repository.Delete(id);
        }

        public async Task<SupplierDTO> Get(Guid id)
        {
            return _mapper.Map<SupplierDTO>(await _repository.Get(id, "Company"));
        }

        public Task<List<SupplierDTO>> List()
        {
            return _repository.List("Company")
                              .OrderBy(a => a.Name)
                              .Select(a => _mapper.Map<SupplierDTO>(a))
                              .ToListAsync();
        }

        public Task<bool> RgExists(string rg)
        {
            return _repository.RgExists(rg);
        }

        public async Task Update(SupplierDTO dto)
        {
            await ValidateSupplier(dto, true);

            var repoObj = _mapper.Map<Supplier>(dto);
            await _repository.Update(repoObj);
        }

        public async Task ValidateSupplier(SupplierDTO dto, bool isUpdate = false)
        {
            bool cnpjChanged = true, rgChanged = true;

            if (dto.Type == "PF")
            {
                ValidationService.ValidateCpf(dto.CpfCnpj);
            } else
            {
                ValidationService.ValidateCnpj(dto.CpfCnpj);
            }

            if (isUpdate)
            {
                var previousState = await Get((Guid)dto.Id);
                if (previousState.CpfCnpj == dto.CpfCnpj)
                {
                    cnpjChanged = false;
                }

                if (previousState.Rg == dto.Rg)
                {
                    rgChanged = false;
                }
            }

            if (cnpjChanged) { 
                var cpfCnpjExists = await CpfCnpjExists(dto.CpfCnpj);
                if (cpfCnpjExists)
                {
                    throw new Exception("This Cpf/Cnpj already exists.");
                }
            }

            if (dto.Type == "PF")
            {
                if (string.IsNullOrEmpty(dto.Rg) || dto.BirthDate == null)
                {
                    throw new Exception("Rg and Birth Date are Mandatory for PF Suppliers");
                }

                var company = await _companyService.Get(dto.CompanyId);

                if (company == null)
                {
                    throw new Exception("Invalid company for supplier.");
                }

                if (company.Uf == "PR" && ValidationService.CalculateAge(dto.BirthDate) < 18)
                {
                    throw new Exception("Supplier must be of age.");
                }

                if (rgChanged) { 
                    var rgExists = await RgExists(dto.Rg);
                    if (rgExists)
                    {
                        throw new Exception("This RG already exists.");
                    }
                }
            }
        }

        
    }
}
