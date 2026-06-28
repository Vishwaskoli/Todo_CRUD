using System.ComponentModel.DataAnnotations;

namespace TodoApp.Model.DTOs
{
    public class CategoryCreateDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;
    }
}
