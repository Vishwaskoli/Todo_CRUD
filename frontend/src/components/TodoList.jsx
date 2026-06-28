import React from 'react'

function TodoList({ todos, categories, onEdit, onDelete, onToggleComplete, priorityMap, priorityColors }) {
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat?.name || 'Unknown'
  }

  if (todos.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>No todos found</h3>
        <p>Create your first todo to get started!</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <div key={todo.id} className="todo-item">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.isCompleted}
            onChange={() => onToggleComplete(todo)}
          />
          <div className="todo-content">
            <div className={`todo-title ${todo.isCompleted ? 'completed' : ''}`}>
              {todo.title}
            </div>
            {todo.description && (
              <div className="todo-desc">{todo.description}</div>
            )}
            <div className="todo-meta">
              <span className={`badge badge-priority-${priorityColors[todo.priority] || 'medium'}`}>
                {priorityMap[todo.priority] || 'Medium'}
              </span>
              <span className="badge badge-category">
                {getCategoryName(todo.categoryId)}
              </span>
              <span className="badge badge-date">
                {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="todo-actions">
            <button className="btn btn-success btn-sm" onClick={() => onEdit(todo)}>
              Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TodoList