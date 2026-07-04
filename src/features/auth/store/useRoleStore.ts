import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

type Permission =
  | 'manage_users'
  | 'manage_leads'
  | 'manage_settings'
  | 'view_analytics'
  | 'manage_automation'
  | 'view_leads'

interface Role {
  id: string
  name: string
  permissions: Permission[]
}

interface RoleStore {
  currentRole: Role | null
  permissions: Permission[]
  loading: boolean
  error: string | null
  fetchUserRole: (userId: string) => Promise<void>
  hasPermission: (permission: Permission) => boolean
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  currentRole: null,
  permissions: [],
  loading: false,
  error: null,

  fetchUserRole: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      // Join user_roles with roles to get the role details
      const { data, error } = await supabase
        .from('user_roles')
        .select('role_id, roles(id, name, permissions)')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      const role = data?.roles as unknown as Role | null
      if (role) {
        set({
          currentRole: role,
          permissions: role.permissions,
          loading: false,
        })
      } else {
        // No role assigned — default to viewer permissions
        set({
          currentRole: { id: '', name: 'viewer', permissions: ['view_leads', 'view_analytics'] },
          permissions: ['view_leads', 'view_analytics'],
          loading: false,
        })
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch role'
      set({ error: message, loading: false })
    }
  },

  hasPermission: (permission: Permission) => {
    return get().permissions.includes(permission)
  },
}))
