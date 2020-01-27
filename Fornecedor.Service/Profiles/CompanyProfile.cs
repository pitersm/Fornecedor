using AutoMapper;
using Fornecedor.DAL.Models;
using Fornecedor.Service.DTO;

namespace Fornecedor.Service.Profiles
{
    public class CompanyProfile : Profile
    {
        public CompanyProfile()
        {
            CreateMap<Company, CompanyDTO>();
        }
    }
}
