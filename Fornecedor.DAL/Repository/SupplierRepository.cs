using Fornecedor.DAL.Data;
using Fornecedor.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public class SupplierRepository : BaseRepository<Supplier>, ISupplierRepository
    {
        private DbSet<Supplier> suppliers;

        public SupplierRepository(DataContext context) : base(context)
        {
            suppliers = context.Set<Supplier>();
        }

        public async Task<bool> CpfCnpjExists(string cpfCnpj)
        {
            var obj = await suppliers.FirstOrDefaultAsync(a => a.CpfCnpj == cpfCnpj);
            return obj != null;
        }

        public async Task<bool> RgExists(string rg)
        {
            var obj = await suppliers.FirstOrDefaultAsync(a => a.Rg == rg);
            return obj != null;
        }
    }
}
