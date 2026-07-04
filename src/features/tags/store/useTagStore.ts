import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Tag {
  id: string
  name: string
  color: string
  created_at: string
}

interface TagStore {
  tags: Tag[]
  leadTags: Tag[]
  loading: boolean
  fetchTags: () => Promise<void>
  createTag: (name: string, color: string) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
  assignTag: (leadId: string, tagId: string) => Promise<void>
  removeTag: (leadId: string, tagId: string) => Promise<void>
  fetchLeadTags: (leadId: string) => Promise<void>
}

export const useTagStore = create<TagStore>()((set) => ({
  tags: [],
  leadTags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      set({ tags: data as Tag[], loading: false })
    } catch (error) {
      console.error('Failed to fetch tags:', error)
      set({ loading: false })
    }
  },

  createTag: async (name: string, color: string) => {
    const { data, error } = await supabase
      .from('tags')
      .insert({ name, color })
      .select()
      .single()
    if (error) throw error
    const tag = data as Tag
    set((state) => ({ tags: [...state.tags, tag] }))
    return tag
  },

  deleteTag: async (id: string) => {
    const { error } = await supabase.from('tags').delete().eq('id', id)
    if (error) throw error
    set((state) => ({ tags: state.tags.filter((t) => t.id !== id) }))
  },

  assignTag: async (leadId: string, tagId: string) => {
    const { error } = await supabase
      .from('lead_tags')
      .insert({ lead_id: leadId, tag_id: tagId })
    if (error) throw error
  },

  removeTag: async (leadId: string, tagId: string) => {
    const { error } = await supabase
      .from('lead_tags')
      .delete()
      .eq('lead_id', leadId)
      .eq('tag_id', tagId)
    if (error) throw error
    set((state) => ({
      leadTags: state.leadTags.filter((t) => t.id !== tagId),
    }))
  },

  fetchLeadTags: async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('lead_tags')
        .select('tags(*)')
        .eq('lead_id', leadId)
      if (error) throw error
      const tags = (data || []).map((row: any) => row.tags).filter(Boolean) as Tag[]
      set({ leadTags: tags })
    } catch (error) {
      console.error('Failed to fetch lead tags:', error)
    }
  },
}))
