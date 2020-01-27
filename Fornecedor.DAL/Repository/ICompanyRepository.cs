using Fornecedor.DAL.Models;
using System;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public interface ICompanyRepository : IRepository<Company>
    {
        Task<bool> CnpjExists(string cnpj);
        Task<string> GetCnpj(Guid id);
    }
}
