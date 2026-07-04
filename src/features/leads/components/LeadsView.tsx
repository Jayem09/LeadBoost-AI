import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { LeadForm } from './LeadForm'
import { BulkActionBar } from './BulkActionBar'
import { AdvancedSearch } from './AdvancedSearch'
import { useLeadStore } from '../store/useLeadStore'
import { useBulkSelectionStore } from '../store/useBulkSelectionStore'
import { useSearchStore } from '../store/useSearchStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { leadService } from '../services/leadService'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MoreHorizontal, Plus, Users, Trash2, Edit } from 'lucide-react'
import type { Lead } from '@/types'

export function LeadsView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { leads, removeLead, fetchLeads, setLeads } = useLeadStore()
  const { selectedIds, toggleSelect, selectAll } = useBulkSelectionStore()
  const { query, filters, sortBy, sortDirection } = useSearchStore()
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    if (!user) return

    fetchLeads(user.id)

    const unsubscribe = leadService.subscribe(user.id, (leads) => {
      setLeads(leads)
    })

    return () => unsubscribe()
  }, [user, fetchLeads, setLeads])

  // Client-side filtering + sorting using the search store state
  const filteredLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      // Full-text search across name, email, company
      const matchesQuery =
        !query ||
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.company.toLowerCase().includes(query.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status === 'all' || lead.status === filters.status

      // Industry filter
      const matchesIndustry =
        !filters.industry || lead.industry === filters.industry

      // Source filter
      const matchesSource =
        !filters.source || lead.source === filters.source

      // Date range filter
      const leadDate = new Date(lead.createdAt)
      const matchesDateFrom =
        !filters.dateFrom || leadDate >= new Date(filters.dateFrom)
      const matchesDateTo =
        !filters.dateTo || leadDate <= new Date(filters.dateTo + 'T23:59:59')

      // Score range filter
      const matchesScoreMin =
        !filters.scoreMin || lead.leadScore >= Number(filters.scoreMin)
      const matchesScoreMax =
        !filters.scoreMax || lead.leadScore <= Number(filters.scoreMax)

      return (
        matchesQuery &&
        matchesStatus &&
        matchesIndustry &&
        matchesSource &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesScoreMin &&
        matchesScoreMax
      )
    })

    // Sort results
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'leadScore':
          comparison = a.leadScore - b.leadScore
          break
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })

    return result
  }, [leads, query, filters, sortBy, sortDirection])

  const filteredIds = filteredLeads.map((l) => l.id)
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id))

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setShowForm(true)
    setOpenMenu(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lead?')) {
      await removeLead(id)
    }
    setOpenMenu(null)
  }

  return (
    <div>
      <TopNav title="Leads" subtitle="Manage and track all your leads" />

      <div className="p-6 space-y-4">
        {/* Advanced search + filter bar */}
        <AdvancedSearch />

        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => setShowImportModal(true)}>
            Import CSV
          </Button>
          <Button size="sm" onClick={() => { setEditingLead(null); setShowForm(true) }}>
            <Plus className="h-4 w-4 mr-1" /> Add Lead
          </Button>
        </div>

        {filteredLeads.length === 0 ? (
          <EmptyState icon={Users} title="No leads found" description="Adjust your filters or add a new lead" />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-secondary w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => selectAll(filteredIds)}
                      className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                    />
                  </th>
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
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                      />
                    </td>
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

      <CsvImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={() => {
          if (user) fetchLeads(user.id)
          setShowImportModal(false)
        }}
      />

      <BulkActionBar />
    </div>
  )
}
