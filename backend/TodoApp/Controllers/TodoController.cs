using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using TodoApp.Data;
using TodoApp.Model;
using TodoApp.Model.DTOs;
using TodoApp.Service;

namespace TodoApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController(ITodoService service) : ControllerBase
    {
        private readonly ITodoService _service = service;

        [HttpGet]
        public ActionResult<List<TodoItem>> GetAllTodo([FromQuery] string? search,
            [FromQuery] int? categoryId,
            [FromQuery] PriorityLevel? priority)
        {
            List<TodoItem> todoItems = _service.GetAll(search, categoryId, priority);
            return Ok(ApiResponse<List<TodoItem>>.SuccessResponse(todoItems));
        }

        [HttpGet("{id}")]
        public ActionResult<TodoItem> GetById([FromRoute] int id)
        {
            TodoItem todoItem = _service.GetById(id);

            if (todoItem == null)
                return NotFound(ApiResponse<TodoItem>.ErrorResponse($"There are no items to display"));

            return Ok(ApiResponse<TodoItem>.SuccessResponse(todoItem));
        }

        [HttpPost]
        public ActionResult<ApiResponse<TodoItem>> Create([FromBody] TodoItemCreateDto todo)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<TodoItem>.ErrorResponse("Validation failed", errors));
            }

            TodoItem todoItem = _service.Add(todo);
        

            return CreatedAtAction(nameof(GetById), new { id = todoItem.Id },
                ApiResponse<TodoItem>.SuccessResponse(todoItem, "Todo item created successfully."));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<TodoItem>>> Update([FromRoute]int id, [FromBody] TodoItemUpdateDto todo)
        {

            TodoItem todoItem = _service.Update(id,todo);

            if(todoItem == null)
                return NotFound(ApiResponse<TodoItem>.ErrorResponse($"Todo item with id {id} not found."));

            return Ok(ApiResponse<TodoItem>.SuccessResponse(todoItem, "Todo item updated successfully."));
        }

        [HttpDelete("{id}")]
        public ActionResult<ApiResponse<object>> Delete([FromRoute]int id)
        {
            var item = _service.GetById(id);
            if (item == null)
                return NotFound(ApiResponse<object>.ErrorResponse($"Todo item with ID {id} not found."));

            _service.Delete(item);

            return Ok(ApiResponse<object>.SuccessResponse(null!, "Todo item deleted successfully."));
        }

        [HttpGet("categories")]
        public ActionResult<ApiResponse<List<Category>>> GetCategories()
        {
            var categories = _service.GetCategories();
            return Ok(ApiResponse<List<Category>>.SuccessResponse(categories));
        }
    }
}
