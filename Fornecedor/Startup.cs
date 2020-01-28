using AutoMapper;
using Fornecedor.DAL.Data;
using Fornecedor.DAL.Models;
using Fornecedor.DAL.Repository;
using Fornecedor.Service;
using Fornecedor.Service.DTO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.OpenApi.Models;
using System;
using System.IO;

namespace Fornecedor
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1",
                    new OpenApiInfo
                    {
                        Title = "Fornecedor API",
                        Version = "v1",
                    });

                string caminhoAplicacao =
                    PlatformServices.Default.Application.ApplicationBasePath;
                string nomeAplicacao =
                    PlatformServices.Default.Application.ApplicationName;
            });

            services.AddMvc();
            services.AddHttpClient();
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers();
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<ISupplierService, SupplierService>();
            services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
            services.AddScoped(typeof(ISupplierRepository), typeof(SupplierRepository));
            services.AddScoped(typeof(ICompanyRepository), typeof(CompanyRepository));

            services.AddCors();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Supplier, SupplierDTO>();
                cfg.CreateMap<SupplierDTO, Supplier>()
                    .ForMember(dest => dest.Company, m => m.MapFrom(a => new Company() { Id = (Guid) a.Company.Id }));
                cfg.CreateMap<CompanyDTO, Company>();
                cfg.CreateMap<Company, CompanyDTO>();
            });
            IMapper mapper = config.CreateMapper();
            services.AddSingleton(mapper);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json",
                    "Fornecedor API");
            });

            app.UseAuthorization();

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
