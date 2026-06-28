using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using TodoApp.Model;

namespace TodoApp.Data
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }

        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Work" },
                new Category { Id = 2, Name = "Personal" }
            );

            modelBuilder.Entity<TodoItem>()
                .Property(t => t.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<TodoItem>()
                .HasIndex(t => t.Title);

            modelBuilder.Entity<TodoItem>()
                .HasIndex(t => t.CategoryId);

            modelBuilder.Entity<TodoItem>()
                .HasIndex(t => t.Priority);

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Name);
        }
    }
}
