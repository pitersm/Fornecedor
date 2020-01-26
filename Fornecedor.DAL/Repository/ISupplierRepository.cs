using Fornecedor.DAL.Models;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<bool> CpfCnpjExists(string cpfCnpj);
    }
}
