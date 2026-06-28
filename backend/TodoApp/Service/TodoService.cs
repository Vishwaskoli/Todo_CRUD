using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Model;
using TodoApp.Model.DTOs;

namespace TodoApp.Service
{
    public class TodoService(TodoContext context) : ITodoService
    {
        private readonly TodoContext _context = context;

        public List<TodoItem> GetAll(string? search, int? categoryId, PriorityLevel? priority)
        {
            var query = _context.TodoItems
                .Include(x => x.Category)
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(t => t.Title.Contains(search) ||
                                        (t.Description != null && t.Description.Contains(search)));
            }

            // Filter by category
            if (categoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == categoryId.Value);
            }

            // Filter by priority
            if (priority.HasValue)
            {
                query = query.Where(t => t.Priority == priority.Value);
            }

            var items = query.OrderByDescending(t => t.CreatedAt).ToList();

            return items;
        }

        public TodoItem GetById(int id)
        {
            var item = _context.TodoItems
                .Include(t => t.Category)
                .FirstOrDefault(t => t.Id == id);

            return item;
        }

        public TodoItem Add(TodoItemCreateDto dto)
        {
            TodoItem todo = new()
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                CategoryId = dto.CategoryId
            };

            //Console.WriteLine(todo);

            _context.TodoItems.Add(todo);
            _context.SaveChanges();

            return todo;
        }

        public TodoItem Update(int id, TodoItemUpdateDto todo)
        {
            var existing = _context.TodoItems.Find(id);
            if (existing == null)
                return null;

            existing.Title = todo.Title;
            existing.Description = todo.Description;
            existing.Priority = todo.Priority;
            existing.CategoryId = todo.CategoryId;
            existing.IsCompleted = todo.IsCompleted;

            _context.SaveChanges();
            return existing;
        }

        public List<Category> GetCategories()
        {
            return _context.Categories.ToList();
        }

        public void Delete(TodoItem item)
        {
            _context.TodoItems.Remove(item);
            _context.SaveChanges();
        }
    }
}
