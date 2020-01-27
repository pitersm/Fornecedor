using Fornecedor.DAL.Models;
using System;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<bool> CpfCnpjExists(string cpfCnpj);
        //Task<bool> GetCpfCnpj(Guid id);
        Task<bool> RgExists(string rg);
        //Task<bool> GetRg(Guid id);
    }
}
