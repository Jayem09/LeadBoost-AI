import { supabase } from '@/lib/supabase'
import type { Lead, LeadStatus } from '@/types'

const TABLE = 'leads'

export const leadService = {
  subscribe: (userId: string, callback: (leads: Lead[]) => void) => {
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE, filter: `user_id=eq.${userId}` },
        async () => {
          const { data } = await supabase
            .from(TABLE)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
          callback(data || [])
        }
      )
      .subscribe()

    // Initial fetch
    supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => callback(data || []))

    return () => {
      supabase.removeChannel(channel)
    }
  },

  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  create: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        budget: lead.budget,
        industry: lead.industry,
        service_needed: lead.serviceNeeded,
        timeline: lead.timeline,
        status: lead.status,
        tags: lead.tags,
        notes: lead.notes,
        lead_score: lead.leadScore,
        source: lead.source,
        user_id: lead.userId,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  update: async (id: string, data: Partial<Lead>) => {
    const updateData: Record<string, any> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.company !== undefined) updateData.company = data.company
    if (data.budget !== undefined) updateData.budget = data.budget
    if (data.industry !== undefined) updateData.industry = data.industry
    if (data.serviceNeeded !== undefined) updateData.service_needed = data.serviceNeeded
    if (data.timeline !== undefined) updateData.timeline = data.timeline
    if (data.status !== undefined) updateData.status = data.status
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.leadScore !== undefined) updateData.lead_score = data.leadScore
    if (data.source !== undefined) updateData.source = data.source

    const { error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
    if (error) throw error
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  updateStatus: async (id: string, status: LeadStatus) => {
    const { error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },
}
