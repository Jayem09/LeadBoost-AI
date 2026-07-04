import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  lastUsedAt: Date | null
  createdAt: Date
}

interface ApiKeyStore {
  apiKeys: ApiKey[]
  loading: boolean
  error: string | null
  fetchKeys: () => Promise<void>
  createKey: (name: string) => Promise<string>
  deleteKey: (id: string) => Promise<void>
  revokeKey: (id: string) => Promise<void>
}

/** Generate a cryptographically random hex string */
function generateRandomHex(length: number): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Build full API key: prefix + random hex */
function generateApiKey(): string {
  return `lb_${generateRandomHex(32)}`
}

/** Extract the visible prefix (last 4 chars after the prefix) */
function getKeyPrefix(fullKey: string): string {
  return fullKey.slice(-4)
}

function mapRow(row: Record<string, unknown>): ApiKey {
  return {
    id: row.id as string,
    name: row.name as string,
    keyPrefix: row.key_prefix as string,
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at as string) : null,
    createdAt: new Date(row.created_at as string),
  }
}

export const useApiKeyStore = create<ApiKeyStore>((set) => ({
  apiKeys: [],
  loading: false,
  error: null,

  fetchKeys: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, key, last_used_at, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      set({
        apiKeys: (data || []).map((row: Record<string, unknown>) => ({
          id: row.id as string,
          name: row.name as string,
          keyPrefix: getKeyPrefix(row.key as string),
          lastUsedAt: row.last_used_at ? new Date(row.last_used_at as string) : null,
          createdAt: new Date(row.created_at as string),
        })),
        loading: false,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch API keys'
      set({ error: message, loading: false })
    }
  },

  createKey: async (name: string) => {
    set({ error: null })
    try {
      const fullKey = generateApiKey()

      const { error } = await supabase.from('api_keys').insert({
        name,
        key: fullKey,
      })

      if (error) throw error

      // Refetch to get the persisted row with id and created_at
      await useApiKeyStore.getState().fetchKeys()

      return fullKey
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create API key'
      set({ error: message })
      throw error
    }
  },

  deleteKey: async (id: string) => {
    set({ error: null })
    try {
      const { error } = await supabase.from('api_keys').delete().eq('id', id)
      if (error) throw error
      set((state) => ({
        apiKeys: state.apiKeys.filter((k) => k.id !== id),
      }))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete API key'
      set({ error: message })
      throw error
    }
  },

  revokeKey: async (id: string) => {
    // Revoke = delete in this context (same as deleteKey, but semantically distinct for future revocation logic)
    return useApiKeyStore.getState().deleteKey(id)
  },
}))
