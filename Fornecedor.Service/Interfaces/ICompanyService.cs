using Fornecedor.Service.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fornecedor.Service
{
    public interface ICompanyService : IBaseEntityService<CompanyDTO>
    {
        Task<bool> CnpjExists(string cnpj);
    }
}