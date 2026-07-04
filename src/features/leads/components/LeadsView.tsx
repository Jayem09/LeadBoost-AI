import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { LeadForm } from './LeadForm'
import { useLeadStore } from '../store/useLeadStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS, INDUSTRIES } from '@/lib/constants'
import { MoreHorizontal, Plus, Users, Trash2, Edit } from 'lucide-react'
import type { LeadStatus, Lead } from '@/types'

export function LeadsView() {
  const navigate = useNavigate()
  const { leads, search, setSearch, statusFilter, setStatusFilter, deleteLead } = useLeadStore()
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setShowForm(true)
    setOpenMenu(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this lead?')) {
      deleteLead(id)
    }
    setOpenMenu(null)
  }

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
          <Button size="sm" onClick={() => { setEditingLead(null); setShowForm(true) }}>
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
                    className="border-b border-border hover:bg-card/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-primary">{lead.name}</td>
                    <td className="py-3 px-4 text-sm text-secondary">{lead.company}</td>
                    <td className="py-3 px-4 text-sm text-secondary">{lead.email}</td>
                    <td className="py-3 px-4 text-sm text-primary">{formatCurrency(lead.budget)}</td>
                    <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
                    <td className="py-3 px-4"><LeadScoreBadge score={lead.leadScore} /></td>
                    <td className="py-3 px-4 text-sm text-secondary">{formatDate(lead.createdAt)}</td>
                    <td className="py-3 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenu(openMenu === lead.id ? null : lead.id)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {openMenu === lead.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 rounded-md border border-border bg-card shadow-lg z-10">
                          <button
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-background"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-background"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeadForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingLead(null) }}
        lead={editingLead}
      />
    </div>
  )
}
