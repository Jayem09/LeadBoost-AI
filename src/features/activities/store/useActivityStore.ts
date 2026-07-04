import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Activity, ActivityType } from '@/types'

interface ActivityStore {
  activities: Activity[]
  loading: boolean
  fetchActivities: (leadId: string) => Promise<void>
  logActivity: (
    leadId: string,
    type: ActivityType,
    description: string,
    metadata?: Record<string, unknown>
  ) => Promise<void>
}

export const useActivityStore = create<ActivityStore>()((set) => ({
  activities: [],
  loading: false,

  fetchActivities: async (leadId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({
        activities: (data ?? []).map((a) => ({
          id: a.id,
          type: a.type,
          description: a.description,
          leadId: a.lead_id,
          metadata: a.metadata,
          createdAt: new Date(a.created_at),
        })),
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      set({ loading: false })
    }
  },

  logActivity: async (
    leadId: string,
    type: ActivityType,
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          type,
          description,
          lead_id: leadId,
          metadata: metadata ?? null,
        })
        .select()
        .single()

      if (error) throw error

      const newActivity: Activity = {
        id: data.id,
        type: data.type,
        description: data.description,
        leadId: data.lead_id,
        metadata: data.metadata,
        createdAt: new Date(data.created_at),
      }

      set((state) => ({
        activities: [newActivity, ...state.activities],
      }))
    } catch (error) {
      console.error('Failed to log activity:', error)
      throw error
    }
  },
}))
