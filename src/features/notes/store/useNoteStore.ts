import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface Note {
  id: string
  lead_id: string
  content: string
  created_by: string
  created_at: string
}

interface NoteStore {
  notes: Note[]
  loading: boolean
  error: string | null
  fetchNotes: (leadId: string) => Promise<void>
  addNote: (leadId: string, content: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

export const useNoteStore = create<NoteStore>()((set) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async (leadId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ notes: data || [], loading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notes'
      set({ error: message, loading: false })
    }
  },

  addNote: async (leadId: string, content: string) => {
    set({ error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to add a note')

      const { data, error } = await supabase
        .from('notes')
        .insert({
          lead_id: leadId,
          content,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      set((state) => ({ notes: [data, ...state.notes] }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add note'
      set({ error: message })
      throw error
    }
  },

  deleteNote: async (id: string) => {
    set({ error: null })
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete note'
      set({ error: message })
      throw error
    }
  },
}))
