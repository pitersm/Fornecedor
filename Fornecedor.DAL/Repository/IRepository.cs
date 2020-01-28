using Fornecedor.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fornecedor.DAL.Repository
{
    public interface IRepository<TEntity> where TEntity : class, BaseModel
    {
        IQueryable<TEntity> List(string navigation = null);
        Task<TEntity> Get(Guid id, string navigation = null);
        Task<TEntity> Save(TEntity entity);
        Task Update(TEntity entity);
        Task Delete(Guid id);
    }
}
