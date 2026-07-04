import type { LeadStatus, TaskStatus } from '@/types'

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  qualified: '#8B5CF6',
  contacted: '#F59E0B',
  meeting: '#6366F1',
  proposal: '#EC4899',
  won: '#22C55E',
  lost: '#EF4444',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  qualified: 'Qualified',
  contacted: 'Contacted',
  meeting: 'Meeting',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
}

export const PIPELINE_COLUMNS: LeadStatus[] = [
  'new', 'qualified', 'contacted', 'meeting', 'proposal', 'won', 'lost',
]

export const LEAD_SCORE_RANGES = [
  { label: 'Cold', min: 0, max: 19, color: '#71717A' },
  { label: 'Warm', min: 20, max: 34, color: '#F59E0B' },
  { label: 'Hot', min: 35, max: 100, color: '#EF4444' },
]

export const INDUSTRIES = [
  'Technology', 'Healthcare', 'Real Estate', 'Finance', 'Education',
  'Manufacturing', 'Retail', 'Marketing', 'Consulting', 'Other',
]

export const LEAD_SOURCES = [
  'Website', 'Referral', 'Cold Call', 'LinkedIn', 'Email Campaign',
  'Trade Show', 'Social Media', 'Partner', 'Inbound', 'Other',
]

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  pending: 'warning',
  in_progress: 'default',
  completed: 'success',
}
