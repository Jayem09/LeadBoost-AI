import { create } from 'zustand'
import type { Lead, LeadStatus } from '@/types'
import { leadService } from '../services/leadService'

interface LeadStore {
  leads: Lead[]
  loading: boolean
  search: string
  statusFilter: LeadStatus | 'all'
  setLeads: (leads: Lead[]) => void
  setSearch: (search: string) => void
  setStatusFilter: (status: LeadStatus | 'all') => void
  addLead: (lead: Lead) => void
  updateLead: (id: string, data: Partial<Lead>) => void
  deleteLead: (id: string) => void
  updateStatus: (id: string, status: LeadStatus) => void
  fetchLeads: (userId: string) => Promise<void>
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  editLead: (id: string, data: Partial<Lead>) => Promise<void>
  removeLead: (id: string) => Promise<void>
  changeStatus: (id: string, status: LeadStatus) => Promise<void>
}

export const useLeadStore = create<LeadStore>()((set) => ({
  leads: [],
  loading: false,
  search: '',
  statusFilter: 'all',

  setLeads: (leads) => set({ leads, loading: false }),
  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),

  updateLead: (id, data) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
    })),

  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date() } : l)),
    })),

  fetchLeads: async (userId: string) => {
    set({ loading: true })
    try {
      const data = await leadService.getAll(userId)
      set({ leads: data as Lead[], loading: false })
    } catch (error) {
      console.error('Failed to fetch leads:', error)
      set({ loading: false })
    }
  },

  createLead: async (lead) => {
    try {
      const created = await leadService.create(lead)
      set((state) => ({ leads: [created as Lead, ...state.leads] }))
    } catch (error) {
      console.error('Failed to create lead:', error)
      throw error
    }
  },

  editLead: async (id, data) => {
    try {
      await leadService.update(id, data)
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
      }))
    } catch (error) {
      console.error('Failed to update lead:', error)
      throw error
    }
  },

  removeLead: async (id) => {
    try {
      await leadService.delete(id)
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete lead:', error)
      throw error
    }
  },

  changeStatus: async (id, status) => {
    try {
      await leadService.updateStatus(id, status)
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date() } : l)),
      }))
    } catch (error) {
      console.error('Failed to update status:', error)
      throw error
    }
  },
}))
