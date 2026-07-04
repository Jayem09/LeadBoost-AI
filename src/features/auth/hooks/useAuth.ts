import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { authService } from '../services/supabase'

export function useAuth() {
  const { user, loading, setUser } = useAuthStore()

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return { user, loading, isAuthenticated: !!user }
}
