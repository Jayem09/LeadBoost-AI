export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  budget: number
  industry: string
  serviceNeeded: string
  timeline: string
  status: LeadStatus
  tags: string[]
  notes: string
  leadScore: number
  source: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Activity {
  id: string
  type: 'created' | 'status_changed' | 'note_added' | 'email_sent' | 'meeting_scheduled'
  description: string
  leadId: string
  createdAt: Date
}
