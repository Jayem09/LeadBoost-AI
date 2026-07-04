import { TopNav } from '@/components/layout/TopNav'
import { useLeadStore } from '@/features/leads/store/useLeadStore'
import { PIPELINE_COLUMNS, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import type { LeadStatus, Lead } from '@/types'

function PipelineCard({ lead }: { lead: Lead }) {
  const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="rounded-lg border border-border bg-background p-3 hover:bg-card/50 transition-colors cursor-grab">
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

function PipelineColumn({ status, leads }: { status: LeadStatus; leads: Lead[] }) {
  return (
    <div className="min-w-[280px] flex-shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
        <span className="text-sm font-medium text-primary">{STATUS_LABELS[status]}</span>
        <span className="text-xs text-secondary bg-card px-1.5 py-0.5 rounded">{leads.length}</span>
      </div>
      <div className="space-y-2">
        {leads.map((lead) => (
          <PipelineCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  )
}

export function PipelineView() {
  const { leads } = useLeadStore()

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
            />
          ))}
        </div>
      </div>
    </div>
  )
}
