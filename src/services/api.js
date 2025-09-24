import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8502/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for adding auth or logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message)

    // Handle specific error cases
    if (error.response?.status === 404) {
      console.warn('API endpoint not found:', error.config.url)
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to trading server. Is it running?')
    }

    return Promise.reject(error)
  }
)

export default api