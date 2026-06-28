using System.ComponentModel.DataAnnotations;

namespace TodoApp.Model.DTOs
{
    public class TodoItemCreateDto
    {
        [Required]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [EnumDataType(typeof(PriorityLevel), ErrorMessage = "Invalid priority level.")]
        public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid category.")]
        public int CategoryId { get; set; }
    }
}
