using Microsoft.EntityFrameworkCore;

namespace Termo
{
    public class TermoContext : DbContext
    {
        public TermoContext(DbContextOptions options)
            : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false, true)
                .Build();
        }

        public DbSet<DayWord> DayWords { get; set; }
    }
}
