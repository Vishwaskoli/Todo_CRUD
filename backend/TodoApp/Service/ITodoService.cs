using TodoApp.Model;
using TodoApp.Model.DTOs;

namespace TodoApp.Service
{
    public interface ITodoService
    {
        TodoItem Add(TodoItemCreateDto dto);
        void Delete(TodoItem item);
        List<TodoItem> GetAll(string? search, int? categoryId, PriorityLevel? priority);
        TodoItem GetById(int id);
        List<Category> GetCategories();
        TodoItem Update(int id, TodoItemUpdateDto todo);
    }
}