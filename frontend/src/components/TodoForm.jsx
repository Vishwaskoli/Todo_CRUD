import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'

function TodoForm({ onSubmit, initialData, categories, isEditing, onCancel, priorityMap }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '1', // Default Medium
    categoryId: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: String(initialData.priority ?? 1),
        categoryId: String(initialData.categoryId ?? '')
      })
    } else {
      setFormData({
        title: '',
        description: '',
        priority: '1',
        categoryId: categories.length > 0 ? String(categories[0].id) : ''
      })
    }
  }, [initialData, categories])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      return
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      priority: parseInt(formData.priority),
      categoryId: parseInt(formData.categoryId)
    }

    const success = await onSubmit(payload)
    if (success && !isEditing) {
      setFormData({
        title: '',
        description: '',
        priority: '1',
        categoryId: categories.length > 0 ? String(categories[0].id) : ''
      })
    }
  }

  return (
    <div className="card">
      <div className="card-title">
        {isEditing ? 'Edit Todo' : 'Add new Todo'}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            name="title"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="2"> High</option>
            <option value="1"> Medium</option>
            <option value="0"> Low</option>
          </select>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Add details (optional)..."
            value={formData.description}
            onChange={handleChange}
            className="full-width"
          />
        </div>
        <div className="btn-group" style={{ marginTop: '14px', marginBottom: 0 }}>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Todo' : 'Add Todo'}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TodoForm