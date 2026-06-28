namespace TodoApp.Model.DTOs
{
    public class TodoItemReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = string.Empty; // Converted enum to string for client readability
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty; // Flattened for easy UI consumption
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
