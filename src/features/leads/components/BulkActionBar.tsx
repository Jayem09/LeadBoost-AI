import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBulkSelectionStore } from '../store/useBulkSelectionStore'
import { useLeadStore } from '../store/useLeadStore'
import { STATUS_LABELS } from '@/lib/constants'
import { X, Trash2, Tag, Download, ChevronDown } from 'lucide-react'
import type { LeadStatus } from '@/types'

export function BulkActionBar() {
  const { selectedIds, clearSelection } = useBulkSelectionStore()
  const { leads, changeStatus, removeLead } = useLeadStore()
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagValue, setTagValue] = useState('')

  const count = selectedIds.size
  if (count === 0) return null

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${count} lead${count > 1 ? 's' : ''}?`)) return
    for (const id of selectedIds) {
      await removeLead(id)
    }
    clearSelection()
  }

  const handleBulkStatusChange = async (status: LeadStatus) => {
    for (const id of selectedIds) {
      await changeStatus(id, status)
    }
    setShowStatusDropdown(false)
    clearSelection()
  }

  const handleBulkAddTag = async () => {
    if (!tagValue.trim()) return
    // Add tag to all selected leads by merging with existing tags
    for (const id of selectedIds) {
      const lead = leads.find((l) => l.id === id)
      if (lead) {
        const newTags = [...new Set([...lead.tags, tagValue.trim()])]
        await useLeadStore.getState().editLead(id, { tags: newTags })
      }
    }
    setTagValue('')
    setShowTagInput(false)
    clearSelection()
  }

  const handleExport = () => {
    const selectedLeads = leads.filter((l) => selectedIds.has(l.id))
    const csv = [
      ['Name', 'Company', 'Email', 'Phone', 'Budget', 'Status', 'Score'].join(','),
      ...selectedLeads.map((l) =>
        [l.name, l.company, l.email, l.phone, l.budget, l.status, l.leadScore].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    clearSelection()
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-xl">
        <Badge variant="default" className="font-semibold">
          {count} selected
        </Badge>

        {/* Delete */}
        <Button variant="danger" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>

        {/* Change Status */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown)
              setShowTagInput(false)
            }}
          >
            Change Status <ChevronDown className="h-3.5 w-3.5 ml-1" />
          </Button>
          {showStatusDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-44 rounded-md border border-border bg-card shadow-lg z-10">
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => (
                <button
                  key={status}
                  className="flex w-full items-center px-3 py-2 text-sm text-primary hover:bg-background"
                  onClick={() => handleBulkStatusChange(status)}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Tag */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowTagInput(!showTagInput)
              setShowStatusDropdown(false)
            }}
          >
            <Tag className="h-4 w-4 mr-1" /> Add Tag
          </Button>
          {showTagInput && (
            <div className="absolute bottom-full mb-2 left-0 w-48 rounded-md border border-border bg-card shadow-lg z-10 p-2">
              <input
                type="text"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBulkAddTag()}
                placeholder="Enter tag..."
                className="w-full h-8 rounded border border-border bg-background px-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowTagInput(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleBulkAddTag}>
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Export */}
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>

        {/* Clear Selection */}
        <Button variant="ghost" size="sm" onClick={clearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
