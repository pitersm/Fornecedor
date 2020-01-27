using Fornecedor.Service.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fornecedor.Service
{
    public interface IBaseEntityService<EntityDTO> where EntityDTO : BaseDTO
    {
        Task<List<EntityDTO>> List();
        Task<EntityDTO> Get(Guid id);
        Task<EntityDTO> Create(EntityDTO dto);
        Task Update(EntityDTO dto);
        Task Delete(Guid id);
    }
}