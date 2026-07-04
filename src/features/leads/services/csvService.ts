import type { Lead, LeadStatus } from '@/types'

/** CSV column headers mapping to Lead fields */
const FIELD_MAP: Record<string, keyof Lead> = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  company: 'company',
  budget: 'budget',
  industry: 'industry',
  service_needed: 'serviceNeeded',
  serviceNeeded: 'serviceNeeded',
  timeline: 'timeline',
  status: 'status',
  tags: 'tags',
  notes: 'notes',
  lead_score: 'leadScore',
  leadScore: 'leadScore',
  source: 'source',
}

/** Available export columns for selection */
export const EXPORT_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'company', label: 'Company' },
  { key: 'budget', label: 'Budget' },
  { key: 'industry', label: 'Industry' },
  { key: 'serviceNeeded', label: 'Service Needed' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'status', label: 'Status' },
  { key: 'tags', label: 'Tags' },
  { key: 'leadScore', label: 'Lead Score' },
  { key: 'source', label: 'Source' },
  { key: 'notes', label: 'Notes' },
] as const

export type ExportColumnKey = (typeof EXPORT_COLUMNS)[number]['key']

/** Convert a value to a safe CSV cell */
function toCSVCell(value: unknown): string {
  const str = String(value ?? '')
  // Wrap in quotes if it contains comma, newline, or double quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/** Convert an array of leads to CSV string */
export function exportToCSV(
  leads: Lead[],
  columns: ExportColumnKey[]
): void {
  const headers = columns
  const rows = leads.map((lead) =>
    columns.map((col) => {
      const val = lead[col as keyof Lead]
      if (Array.isArray(val)) return toCSVCell(val.join('; '))
      return toCSVCell(val)
    })
  )

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/** Read a CSV file and return array of objects */
export function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) {
        reject(new Error('Empty file'))
        return
      }

      const lines = text.split(/\r?\n/).filter((l) => l.trim())
      if (lines.length < 2) {
        reject(new Error('CSV must have a header row and at least one data row'))
        return
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
      const data = lines.slice(1).map((line) => {
        // Handle quoted fields
        const values: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"'
              i++ // skip escaped quote
            } else {
              inQuotes = !inQuotes
            }
          } else if (line[i] === ',' && !inQuotes) {
            values.push(current.trim())
            current = ''
          } else {
            current += line[i]
          }
        }
        values.push(current.trim())

        const row: Record<string, string> = {}
        headers.forEach((h, idx) => {
          row[h] = values[idx] ?? ''
        })
        return row
      })

      resolve(data)
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export interface ValidationError {
  row: number
  field: string
  message: string
}

/** Validate imported CSV data against lead schema */
export function validateCSVData(
  data: Record<string, string>[]
): { valid: Record<string, string>[]; errors: ValidationError[] } {
  const errors: ValidationError[] = []
  const valid: Record<string, string>[] = []

  const VALID_STATUSES: LeadStatus[] = [
    'new', 'qualified', 'contacted', 'meeting', 'proposal', 'won', 'lost',
  ]

  data.forEach((row, idx) => {
    const rowNum = idx + 2 // +2 for 1-indexed + header
    const rowErrors: ValidationError[] = []

    // Required fields
    if (!row.name?.trim()) {
      rowErrors.push({ row: rowNum, field: 'name', message: 'Name is required' })
    }
    if (!row.email?.trim()) {
      rowErrors.push({ row: rowNum, field: 'email', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      rowErrors.push({ row: rowNum, field: 'email', message: 'Invalid email format' })
    }

    // Validate budget is a number
    if (row.budget && isNaN(Number(row.budget))) {
      rowErrors.push({ row: rowNum, field: 'budget', message: 'Budget must be a number' })
    }

    // Validate status if provided
    if (row.status && !VALID_STATUSES.includes(row.status as LeadStatus)) {
      rowErrors.push({
        row: rowNum,
        field: 'status',
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      })
    }

    // Validate lead score is a number between 0-100
    if (row.lead_score || row.leadScore) {
      const score = Number(row.lead_score || row.leadScore)
      if (isNaN(score) || score < 0 || score > 100) {
        rowErrors.push({
          row: rowNum,
          field: 'lead_score',
          message: 'Lead score must be a number between 0 and 100',
        })
      }
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors)
    } else {
      valid.push(row)
    }
  })

  return { valid, errors }
}

/** Convert raw CSV row to a partial Lead object for insertion */
export function mapCSVRowToLead(
  row: Record<string, string>,
  userId: string
): Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    company: row.company || '',
    budget: Number(row.budget) || 0,
    industry: row.industry || '',
    serviceNeeded: row.service_needed || row.serviceNeeded || '',
    timeline: row.timeline || '',
    status: (row.status as LeadStatus) || 'new',
    tags: row.tags ? row.tags.split(';').map((t) => t.trim()).filter(Boolean) : [],
    notes: row.notes || '',
    leadScore: Number(row.lead_score || row.leadScore) || 0,
    source: row.source || 'csv_import',
    userId,
  }
}
