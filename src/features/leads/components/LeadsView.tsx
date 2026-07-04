import { TopNav } from '@/components/layout/TopNav'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import { useLeadStore } from '../store/useLeadStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS, INDUSTRIES } from '@/lib/constants'
import { MoreHorizontal, Plus, Users } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import type { LeadStatus } from '@/types'

export function LeadsView() {
  const { leads, search, setSearch, statusFilter, setStatusFilter } = useLeadStore()

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <TopNav title="Leads" subtitle="Manage and track all your leads" />

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <SearchInput placeholder="Search leads..." onSearch={setSearch} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm text-primary"
          >
            <option value="all">All Status</option>
            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select className="h-10 rounded-md border border-border bg-background px-3 text-sm text-primary">
            <option value="">All Industries</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Lead
          </Button>
        </div>

        {filteredLeads.length === 0 ? (
          <EmptyState icon={Users} title="No leads found" description="Add your first lead to get started" />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Budget</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Score</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Created</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border hover:bg-card/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-primary">{lead.name}</td>
                    <td className="py-3 px-4 text-sm text-secondary">{lead.company}</td>
                    <td className="py-3 px-4 text-sm text-secondary">{lead.email}</td>
                    <td className="py-3 px-4 text-sm text-primary">{formatCurrency(lead.budget)}</td>
                    <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
                    <td className="py-3 px-4"><LeadScoreBadge score={lead.leadScore} /></td>
                    <td className="py-3 px-4 text-sm text-secondary">{formatDate(lead.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
