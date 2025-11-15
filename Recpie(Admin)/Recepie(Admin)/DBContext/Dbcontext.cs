using Microsoft.EntityFrameworkCore;
using Recepie_Admin_.Models;

namespace Recepie_Admin_.DBContext
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
    }
}

