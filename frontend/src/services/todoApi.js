import axios from 'axios'

const API_BASE = 'https://localhost:7060/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request/Response interceptors for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config.params || config.data)
    return config
  },
  (error) => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}:`, response.data)
    return response
  },
  (error) => {
    console.error('[API] Response error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const todoApi = {
  // GET /api/Todo - returns RAW ARRAY (not ApiResponse wrapper!)
  getAll: (params) => apiClient.get('/Todo', { params }),

  // GET /api/Todo/{id} - returns raw TodoItem
  getById: (id) => apiClient.get(`/Todo/${id}`),

  // POST /api/Todo - returns ApiResponseOfTodoItem
  create: (data) => apiClient.post('/Todo', data),

  // PUT /api/Todo/{id} - returns ApiResponseOfTodoItem
  update: (id, data) => apiClient.put(`/Todo/${id}`, data),

  // DELETE /api/Todo/{id} - returns ApiResponseOfObject
  delete: (id) => apiClient.delete(`/Todo/${id}`),

  // GET /api/Todo/categories - returns ApiResponseOfListOfCategory
  getCategories: () => apiClient.get('/Todo/categories')
}