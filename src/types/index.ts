export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost'

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

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

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate: string
  assignedTo: string
  leadId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export type ActivityType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'note'
  | 'status_change'
  | 'tag_added'
  | 'custom_field_updated'
  | 'created'

export interface Activity {
  id: string
  type: ActivityType
  description: string
  leadId: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

export type CustomFieldType = 'text' | 'number' | 'select' | 'date' | 'checkbox'

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  options: string[] | null
  userId: string
  createdAt: Date
}

export interface CustomFieldValue {
  id: string
  leadId: string
  fieldId: string
  value: string
  createdAt: Date
}

export type NotificationType = 'lead_created' | 'lead_status_changed' | 'task_assigned' | 'task_completed' | 'mention' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  userId: string
  relatedId?: string
  createdAt: Date
}

// Email Sequence types
export type SequenceStatus = 'draft' | 'active' | 'paused'

export interface SequenceStep {
  id: string
  order: number
  delayDays: number
  templateId: string | null
  triggerCondition: string
}

export interface EmailSequence {
  id: string
  name: string
  description: string
  status: SequenceStatus
  steps: SequenceStep[]
  userId: string
  createdAt: Date
  updatedAt: Date
}
