using AutoMapper;
using Fornecedor.DAL.Models;
using Fornecedor.Service.DTO;

namespace Fornecedor.Service.Profiles
{
    public class SupplierProfile : Profile
    {
        public SupplierProfile()
        {
            CreateMap<Supplier, SupplierDTO>();
        }
    }
}
