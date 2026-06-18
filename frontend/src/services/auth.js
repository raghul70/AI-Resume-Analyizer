import { create } from 'zustand'
import { authService } from './api'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false })
      return
    }

    try {
      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: true, loading: false })
    } catch (error) {
      localStorage.removeItem('access_token')
      set({ user: null, isAuthenticated: false, loading: false })
    }
  },

  login: async (username, password) => {
    try {
      await authService.login(username, password)
      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: true })
      toast.success('Welcome back! 🎉')
      return { success: true }
    } catch (error) {
      toast.error(error.detail || 'Login failed')
      return { success: false, error: error.detail }
    }
  },

  register: async (userData) => {
    try {
      await authService.register(userData)
      toast.success('Account created successfully! Please login.')
      return { success: true }
    } catch (error) {
      toast.error(error.detail || 'Registration failed')
      return { success: false, error: error.detail }
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
    toast.success('Logged out successfully')
  },
}))