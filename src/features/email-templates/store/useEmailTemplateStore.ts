import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  created_at: string
}

interface EmailTemplateState {
  templates: EmailTemplate[]
  loading: boolean
  fetchTemplates: () => Promise<void>
  createTemplate: (name: string, subject: string, body: string) => Promise<void>
  updateTemplate: (id: string, data: Partial<EmailTemplate>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
}

export const useEmailTemplateStore = create<EmailTemplateState>()((set) => ({
  templates: [],
  loading: false,

  fetchTemplates: async () => {
    set({ loading: true })
    const { data } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false })
    set({ templates: data || [], loading: false })
  },

  createTemplate: async (name, subject, body) => {
    const { data } = await supabase.from('email_templates').insert({ name, subject, body }).select().single()
    if (data) set((s) => ({ templates: [data, ...s.templates] }))
  },

  updateTemplate: async (id, data) => {
    await supabase.from('email_templates').update(data).eq('id', id)
    set((s) => ({ templates: s.templates.map((t) => (t.id === id ? { ...t, ...data } : t)) }))
  },

  deleteTemplate: async (id) => {
    await supabase.from('email_templates').delete().eq('id', id)
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) }))
  },
}))
