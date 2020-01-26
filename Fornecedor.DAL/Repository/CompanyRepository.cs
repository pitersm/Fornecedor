using Fornecedor.DAL.Data;
using Fornecedor.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
    {
        private readonly DataContext _context;

        public CompanyRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> CnpjExists(string cnpj)
        {
            var obj = await List().FirstOrDefaultAsync(a => a.Cnpj == cnpj);
            return obj != null;
        }
    }
}
