import { create } from 'zustand'
import type { Lead, LeadStatus } from '@/types'

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
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [],
  loading: true,
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
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
}))
