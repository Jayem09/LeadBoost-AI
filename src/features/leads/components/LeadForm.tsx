import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLeadStore } from '../store/useLeadStore'
import { INDUSTRIES, STATUS_LABELS } from '@/lib/constants'
import type { Lead, LeadStatus } from '@/types'

interface LeadFormProps {
  open: boolean
  onClose: () => void
  lead?: Lead | null
}

export function LeadForm({ open, onClose, lead }: LeadFormProps) {
  const { addLead, updateLead } = useLeadStore()
  const isEditing = !!lead

  const [form, setForm] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    budget: lead?.budget?.toString() || '',
    industry: lead?.industry || 'Technology',
    serviceNeeded: lead?.serviceNeeded || '',
    timeline: lead?.timeline || 'Flexible',
    status: lead?.status || 'new' as LeadStatus,
    source: lead?.source || 'Website',
    tags: lead?.tags?.join(', ') || '',
    notes: lead?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const leadData: Lead = {
      id: lead?.id || Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      budget: parseInt(form.budget) || 0,
      industry: form.industry,
      serviceNeeded: form.serviceNeeded,
      timeline: form.timeline,
      status: form.status,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: form.notes,
      leadScore: lead?.leadScore || Math.floor(Math.random() * 40) + 10,
      source: form.source,
      createdAt: lead?.createdAt || new Date(),
      updatedAt: new Date(),
      userId: 'demo',
    }

    if (isEditing) {
      updateLead(lead.id, leadData)
    } else {
      addLead(leadData)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Lead' : 'Add New Lead'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Name *</label>
            <Input
              required
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Email *</label>
            <Input
              required
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Phone</label>
            <Input
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Company *</label>
            <Input
              required
              placeholder="Acme Corp"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Budget ($)</label>
            <Input
              type="number"
              placeholder="10000"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Industry</label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
            >
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Timeline</label>
            <select
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
            >
              <option>This week</option>
              <option>Next month</option>
              <option>Flexible</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
            >
              <option>Website</option>
              <option>Referral</option>
              <option>Social</option>
              <option>Direct</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Service Needed</label>
            <Input
              placeholder="Web development"
              value={form.serviceNeeded}
              onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-secondary mb-1.5 block">Tags (comma separated)</label>
          <Input
            placeholder="Enterprise, AI, High-Growth"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-secondary mb-1.5 block">Notes</label>
          <textarea
            placeholder="Any additional notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Save Changes' : 'Add Lead'}</Button>
        </div>
      </form>
    </Modal>
  )
}
