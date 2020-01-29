namespace Fornecedor.Service.DTO
{
    public class StateDTO
    {
        public int Id { get; set; }
        public string Sigla { get; set; }
        public string Nome { get; set; }
        public RegionDTO Regiao { get; set; }
    }

    public class RegionDTO
    {
        public int Id { get; set; }
        public string Sigla { get; set; }
        public string Nome { get; set; }
    }
}
