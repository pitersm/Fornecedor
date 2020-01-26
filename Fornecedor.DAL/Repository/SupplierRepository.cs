using Fornecedor.DAL.Data;
using Fornecedor.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public class SupplierRepository : BaseRepository<Supplier>, ISupplierRepository
    {
        private readonly DataContext _context;

        public SupplierRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> CpfCnpjExists(string cpfCnpj)
        {
            var obj = await List().FirstOrDefaultAsync(a => a.CpfCnpj == cpfCnpj);
            return obj != null;
        }

        public async Task<bool> RgExists(string rg)
        {
            var obj = await List().FirstOrDefaultAsync(a => a.Rg == rg);
            return obj != null;
        }
    }
}
