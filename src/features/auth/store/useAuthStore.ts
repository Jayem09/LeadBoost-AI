import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { authService } from '../services/supabase'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),

  login: async (email, password) => {
    try {
      set({ error: null })
      const { error } = await authService.login(email, password)
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message || 'Login failed' })
      throw error
    }
  },

  register: async (email, password, name) => {
    try {
      set({ error: null })
      const { data, error } = await authService.register(email, password, name)
      if (error) throw error
      if (data.user && !data.session) {
        const msg = 'Check your email to confirm your account'
        set({ error: msg })
        throw new Error(msg)
      }
    } catch (error: any) {
      set({ error: error.message || 'Registration failed' })
      throw error
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null })
      const { error } = await authService.loginWithGoogle()
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  loginWithGitHub: async () => {
    try {
      set({ error: null })
      const { error } = await authService.loginWithGitHub()
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  logout: async () => {
    await authService.logout()
    set({ user: null })
  },

  resetPassword: async (email) => {
    const { error } = await authService.resetPassword(email)
    if (error) throw error
  },

  clearError: () => set({ error: null }),
}))
