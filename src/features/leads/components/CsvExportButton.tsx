import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportToCSV, EXPORT_COLUMNS, type ExportColumnKey } from '../services/csvService'
import type { Lead } from '@/types'

interface CsvExportButtonProps {
  leads: Lead[]
  filteredLeads: Lead[]
  selectedLeads: string[]
}

export function CsvExportButton({ leads, filteredLeads, selectedLeads }: CsvExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<ExportColumnKey[]>(
    EXPORT_COLUMNS.map((c) => c.key)
  )
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setShowColumns(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggleColumn = (key: ExportColumnKey) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleExport = (scope: 'all' | 'filtered' | 'selected') => {
    let data: Lead[] = []

    if (scope === 'all') {
      data = leads
    } else if (scope === 'filtered') {
      data = filteredLeads
    } else {
      data = leads.filter((l) => selectedLeads.includes(l.id))
    }

    if (data.length === 0) {
      alert('No leads to export')
      return
    }

    if (selectedColumns.length === 0) {
      alert('Select at least one column')
      return
    }

    exportToCSV(data, selectedColumns)
    setOpen(false)
    setShowColumns(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(!open)}
      >
        <Download className="h-4 w-4 mr-1" /> Export
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-card shadow-lg z-20">
          <div className="py-1">
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-primary hover:bg-background"
              onClick={() => handleExport('all')}
            >
              Export All ({leads.length})
            </button>
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-primary hover:bg-background"
              onClick={() => handleExport('filtered')}
            >
              Export Filtered ({filteredLeads.length})
            </button>
            {selectedLeads.length > 0 && (
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-primary hover:bg-background"
                onClick={() => handleExport('selected')}
              >
                Export Selected ({selectedLeads.length})
              </button>
            )}

            <div className="border-t border-border my-1" />

            <button
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-primary hover:bg-background"
              onClick={() => setShowColumns(!showColumns)}
            >
              Columns
              <ChevronDown
                className={`h-3 w-3 transition-transform ${showColumns ? 'rotate-180' : ''}`}
              />
            </button>

            {showColumns && (
              <div className="border-t border-border py-1 max-h-48 overflow-auto">
                {EXPORT_COLUMNS.map((col) => (
                  <button
                    key={col.key}
                    className="flex w-full items-center gap-2 px-4 py-1.5 text-xs text-primary hover:bg-background"
                    onClick={() => toggleColumn(col.key)}
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${
                        selectedColumns.includes(col.key)
                          ? 'bg-accent border-accent'
                          : 'border-border'
                      }`}
                    >
                      {selectedColumns.includes(col.key) && (
                        <Check className="h-2.5 w-2.5 text-white" />
                      )}
                    </div>
                    {col.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
