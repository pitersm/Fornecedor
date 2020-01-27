using Fornecedor.Service.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fornecedor.Service
{
    public interface ISupplierService : IBaseEntityService<SupplierDTO>
    {
        Task<bool> CpfCnpjExists(string cpfCnpj);
        Task<bool> RgExists(string rg);
    }
}