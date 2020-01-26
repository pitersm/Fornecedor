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
        IQueryable<TEntity> List();
        Task<TEntity> Get(string id);
        Task<TEntity> Save(TEntity entity);
        Task Update(TEntity entity);
        Task Delete(string id);
    }
}
