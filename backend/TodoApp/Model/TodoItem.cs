using System.ComponentModel.DataAnnotations;

namespace TodoApp.Model
{
    public enum PriorityLevel
    {
        Low,
        Medium,
        High
    }

    public class TodoItem
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;

        [Required]
        public int CategoryId { get; set; }
        public Category? Category { get; set; } = null!;

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public override string ToString()
        {
            return "Title: " + Title + " Desc:" + Description + " Category id: " + CategoryId;
        }
    }
}
