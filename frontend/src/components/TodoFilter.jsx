import React from 'react'

function TodoFilter({ filter, onFilterChange, categories, priorityMap }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onFilterChange({ ...filter, [name]: value })
  }

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="search"
        placeholder="Search todos..."
        value={filter.search}
        onChange={handleChange}
      />
      <select name="categoryId" value={filter.categoryId} onChange={handleChange}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select name="priority" value={filter.priority} onChange={handleChange}>
        <option value="">All Priorities</option>
        <option value="2">High</option>
        <option value="1">Medium</option>
        <option value="0">Low</option>
      </select>
    </div>
  )
}

export default TodoFilter