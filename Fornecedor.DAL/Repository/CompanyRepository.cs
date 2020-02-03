using Fornecedor.DAL.Data;
using Fornecedor.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
    {
        private DbSet<Company> companies;

        public CompanyRepository(DataContext context) : base(context)
        {
            companies = context.Set<Company>();
        }

        public async Task<bool> CnpjExists(string cnpj)
        {
            var obj = await companies.FirstOrDefaultAsync(a => a.Cnpj == cnpj);
            return obj != null;
        }

        public async Task<string> GetCnpj(Guid id)
        {
            string cnpj = await companies.Where(a => a.Id == id).Select(b => b.Cnpj).FirstOrDefaultAsync();

            return cnpj;
        }
    }
}
