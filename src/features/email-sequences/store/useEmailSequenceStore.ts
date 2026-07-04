import { create } from 'zustand'
import type { EmailSequence, SequenceStatus } from '@/types'
import { emailSequenceService } from '../services/emailSequenceService'

interface EmailSequenceStore {
  sequences: EmailSequence[]
  loading: boolean
  setSequences: (sequences: EmailSequence[]) => void
  fetchSequences: (userId: string) => Promise<void>
  createSequence: (sequence: Omit<EmailSequence, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSequence: (id: string, data: Partial<EmailSequence>) => Promise<void>
  deleteSequence: (id: string) => Promise<void>
  toggleStatus: (id: string, currentStatus: SequenceStatus) => Promise<void>
}

export const useEmailSequenceStore = create<EmailSequenceStore>()((set) => ({
  sequences: [],
  loading: false,

  setSequences: (sequences) => set({ sequences, loading: false }),

  fetchSequences: async (userId: string) => {
    set({ loading: true })
    try {
      const data = await emailSequenceService.getAll(userId)
      set({ sequences: data as EmailSequence[], loading: false })
    } catch (error) {
      console.error('Failed to fetch email sequences:', error)
      set({ loading: false })
    }
  },

  createSequence: async (sequence) => {
    try {
      const created = await emailSequenceService.create(sequence)
      set((state) => ({ sequences: [created as EmailSequence, ...state.sequences] }))
    } catch (error) {
      console.error('Failed to create email sequence:', error)
      throw error
    }
  },

  updateSequence: async (id, data) => {
    try {
      await emailSequenceService.update(id, data)
      set((state) => ({
        sequences: state.sequences.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }))
    } catch (error) {
      console.error('Failed to update email sequence:', error)
      throw error
    }
  },

  deleteSequence: async (id) => {
    try {
      await emailSequenceService.delete(id)
      set((state) => ({
        sequences: state.sequences.filter((s) => s.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete email sequence:', error)
      throw error
    }
  },

  toggleStatus: async (id, currentStatus) => {
    const newStatus: SequenceStatus = currentStatus === 'active' ? 'paused' : 'active'
    try {
      await emailSequenceService.updateStatus(id, newStatus)
      set((state) => ({
        sequences: state.sequences.map((s) =>
          s.id === id ? { ...s, status: newStatus } : s
        ),
      }))
    } catch (error) {
      console.error('Failed to toggle sequence status:', error)
      throw error
    }
  },
}))
