import { supabase } from '@/lib/supabase'

export const authService = {
  login: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  register: (email: string, password: string, name: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    }),

  loginWithGoogle: () =>
    supabase.auth.signInWithOAuth({ provider: 'google' }),

  loginWithGitHub: () =>
    supabase.auth.signInWithOAuth({ provider: 'github' }),

  logout: () => supabase.auth.signOut(),

  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    }),

  getUser: () => supabase.auth.getUser(),

  onAuthStateChange: (callback: (session: any) => void) =>
    supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    }),
}
