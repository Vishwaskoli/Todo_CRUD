import React, { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import TodoFilter from './components/TodoFilter'
import ConfirmModal from './components/ConfirmModal'
import { todoApi } from './services/todoApi'
import { BriefcaseBusiness, ListRestart, NotebookPen, Redo, RefreshCcw, Search, UserCheck } from 'lucide-react'

// Priority mapping: 0=Low, 1=Medium, 2=High
const PRIORITY_MAP = { 0: 'Low', 1: 'Medium', 2: 'High' }
const PRIORITY_COLORS = { 0: 'low', 1: 'medium', 2: 'high' }

function App() {
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])
  const [editingTodo, setEditingTodo] = useState(null)
  const [filter, setFilter] = useState({ search: '', categoryId: '', priority: '' })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadTodos()
  }, [filter])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3500)
  }

  const loadTodos = async () => {
    setLoading(true)
    try {
      const response = await todoApi.getAll(filter)
      // GET /api/Todo returns RAW ARRAY (not ApiResponse wrapper!)
      const data = Array.isArray(response.data.items) ? response.data.items : response.data?.data || []
      setTodos(data)
    } catch (err) {
      console.error('Load todos error:', err)
      showMessage('error', err.response?.data?.message || 'Failed to load todos')
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await todoApi.getCategories()
      // GET /api/Todo/categories returns ApiResponse wrapper
      const data = response.data?.data || []
      setCategories(data)
    } catch (err) {
      console.error('Load categories error:', err)
      showMessage('error', 'Failed to load categories')
    }
  }

  const handleCreate = async (todoData) => {
    try {
      const response = await todoApi.create(todoData)
      if (response.data?.success) {
        showMessage('success', 'Todo created successfully!')
        loadTodos()
        return true
      }
      showMessage('error', response.data?.message || 'Failed to create')
      return false
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create todo')
      return false
    }
  }

  const handleUpdate = async (todoData) => {
    try {
      const response = await todoApi.update(editingTodo.id, todoData)
      if (response.data?.success) {
        showMessage('success', 'Todo updated successfully!')
        setEditingTodo(null)
        loadTodos()
        return true
      }
      showMessage('error', response.data?.message || 'Failed to update')
      return false
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update todo')
      return false
    }
  }

  const confirmDelete = (id) => {
    setDeleteTarget(id)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const response = await todoApi.delete(deleteTarget)
      if (response.data?.success) {
        showMessage('success', 'Todo deleted successfully!')
        loadTodos()
      } else {
        showMessage('error', response.data?.message || 'Failed to delete')
      }
    } catch (err) {
      showMessage('error', 'Failed to delete todo')
    }
    setDeleteTarget(null)
  }

  const handleToggleComplete = async (todo) => {
    try {
      const updateData = {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        categoryId: todo.categoryId,
        isCompleted: !todo.isCompleted
      }
      const response = await todoApi.update(todo.id, updateData)
      if (response.data?.success) {
        loadTodos()
      }
    } catch (err) {
      showMessage('error', 'Failed to update status')
    }
  }

  const handleEdit = (todo) => {
    setEditingTodo(todo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingTodo(null)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const viewByCategory = (categoryName) => {
    const cat = categories.find(c => c.name?.toLowerCase() === categoryName.toLowerCase())
    if (cat) {
      setFilter(prev => ({ ...prev, categoryId: String(cat.id) }))
    }
  }

  const clearFilters = () => {
    setFilter({ search: '', categoryId: '', priority: '' })
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <span><NotebookPen size={45}/></span>
          Todo App
        </h1>
        <p>Stay organized, get things done</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? '✓' : '✗'} {message.text}
        </div>
      )}

      <TodoForm
        onSubmit={editingTodo ? handleUpdate : handleCreate}
        initialData={editingTodo}
        categories={categories}
        isEditing={!!editingTodo}
        onCancel={handleCancelEdit}
        priorityMap={PRIORITY_MAP}
      />

      <div className="btn-group">
        <button className="btn btn-info" onClick={() => viewByCategory('Work')}>
          <BriefcaseBusiness size={20}/> Work
        </button>
        <button className="btn btn-info" onClick={() => viewByCategory('Personal')}>
          <UserCheck size={20}/> Personal
        </button>
        <button className="btn btn-warning" onClick={clearFilters}>
          <ListRestart size={20}/> All
        </button>
      </div>

      <div className="card">
        <div className="card-title"><Search size={20}></Search> Filter Todos</div>
        <TodoFilter
          filter={filter}
          onFilterChange={handleFilterChange}
          categories={categories}
          priorityMap={PRIORITY_MAP}
        />
      </div>

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <TodoList
          todos={todos}
          categories={categories}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onToggleComplete={handleToggleComplete}
          priorityMap={PRIORITY_MAP}
          priorityColors={PRIORITY_COLORS}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Todo"
          message="Are you sure you want to delete this todo? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default App