using System.Text.Json.Serialization;

namespace TodoApp.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        [JsonIgnore]
        public ICollection<TodoItem> TodoItems { get; set; } = new List<TodoItem>();
    }
}
