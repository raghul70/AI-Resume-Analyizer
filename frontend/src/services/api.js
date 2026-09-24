import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = 'https://ai-resume-analyizer.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    }

    return Promise.reject(error)
  }
)

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Registration failed' }
    }
  },

  login: async (username, password) => {
    try {
      const formData = new URLSearchParams({
        grant_type: 'password',
        username,
        password,
        scope: '',
        client_id: '',
        client_secret: '',
      })

      const response = await api.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
      }

      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Login failed' }
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get user info' }
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
  },
}

export const resumeService = {
  upload: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Upload failed' }
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/api/resume/list')
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch resumes' }
    }
  },

  getOne: async (id) => {
    try {
      const response = await api.get(`/api/resume/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch resume' }
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/api/resume/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to delete resume' }
    }
  },
}

export const analysisService = {
  analyze: async (resumeId, jobDescription) => {
    try {
      const response = await api.post('/api/analysis/analyze', {
        resume_id: resumeId,
        job_description: jobDescription,
      })

      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Analysis failed' }
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/api/analysis/history')
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch history' }
    }
  },

  getOne: async (id) => {
    try {
      const response = await api.get(`/api/analysis/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch analysis' }
    }
  },
}

export default api