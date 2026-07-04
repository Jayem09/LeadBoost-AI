import { TopNav } from '@/components/layout/TopNav'
import { useLeadStore } from '@/features/leads/store/useLeadStore'
import { PIPELINE_COLUMNS, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import type { LeadStatus, Lead } from '@/types'
import { useState } from 'react'

function PipelineCard({ lead }: { lead: Lead }) {
  const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('leadId', lead.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="rounded-lg border border-border bg-card p-3 hover:bg-background transition-colors cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-primary">{lead.name}</p>
          <p className="text-xs text-secondary">{lead.company}</p>
        </div>
        <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-xs font-medium text-accent">{initials}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{formatCurrency(lead.budget)}</span>
        <LeadScoreBadge score={lead.leadScore} />
      </div>
    </div>
  )
}

function PipelineColumn({ status, leads, onDrop }: { status: LeadStatus; leads: Lead[]; onDrop: (leadId: string, status: LeadStatus) => void }) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      className={`min-w-[280px] flex-shrink-0 rounded-lg p-3 transition-colors ${
        dragOver ? 'bg-accent/5 ring-2 ring-accent/30' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const leadId = e.dataTransfer.getData('leadId')
        if (leadId) onDrop(leadId, status)
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
        <span className="text-sm font-medium text-primary">{STATUS_LABELS[status]}</span>
        <span className="text-xs text-secondary bg-background px-1.5 py-0.5 rounded">{leads.length}</span>
      </div>
      <div className="space-y-2">
        {leads.map((lead) => (
          <PipelineCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-xs text-secondary">Drop leads here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function PipelineView() {
  const { leads, changeStatus } = useLeadStore()

  const handleDrop = async (leadId: string, status: LeadStatus) => {
    await changeStatus(leadId, status)
  }

  return (
    <div>
      <TopNav title="Pipeline" subtitle="Drag and drop leads through your sales pipeline" />

      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              leads={leads.filter((l) => l.status === status)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
