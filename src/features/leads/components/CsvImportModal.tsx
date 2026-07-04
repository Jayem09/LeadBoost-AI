import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, ChevronDown } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import {
  parseCSV,
  validateCSVData,
  mapCSVRowToLead,
  type ValidationError,
} from '../services/csvService'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { leadService } from '../services/leadService'
import { cn } from '@/lib/utils'

interface CsvImportModalProps {
  open: boolean
  onClose: () => void
  onImportComplete: () => void
}

type Step = 'upload' | 'preview' | 'mapping' | 'importing' | 'done'

interface ColumnMapping {
  csvColumn: string
  leadField: string
}

const LEAD_FIELDS = [
  { value: 'name', label: 'Name', required: true },
  { value: 'email', label: 'Email', required: true },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'budget', label: 'Budget' },
  { value: 'industry', label: 'Industry' },
  { value: 'serviceNeeded', label: 'Service Needed' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags' },
  { value: 'leadScore', label: 'Lead Score' },
  { value: 'source', label: 'Source' },
  { value: 'notes', label: 'Notes' },
]

/** Auto-detect column mapping from CSV header */
function autoDetectMapping(csvColumns: string[]): ColumnMapping[] {
  const aliases: Record<string, string[]> = {
    name: ['name', 'full_name', 'fullname'],
    email: ['email', 'e-mail', 'email_address'],
    phone: ['phone', 'phone_number', 'telephone', 'mobile'],
    company: ['company', 'company_name', 'organization', 'org'],
    budget: ['budget', 'budget_amount', 'amount'],
    industry: ['industry', 'sector'],
    serviceNeeded: ['service_needed', 'serviceneeded', 'service', 'needs'],
    timeline: ['timeline', 'timeframe', 'deadline'],
    status: ['status', 'lead_status'],
    tags: ['tags', 'labels', 'categories'],
    leadScore: ['lead_score', 'leadscore', 'score'],
    source: ['source', 'lead_source', 'origin'],
    notes: ['notes', 'note', 'comments'],
  }

  return csvColumns.map((col) => {
    const normalized = col.toLowerCase().replace(/[\s-]/g, '_')
    let matchedField = ''

    for (const [field, alts] of Object.entries(aliases)) {
      if (alts.some((a) => normalized.includes(a))) {
        matchedField = field
        break
      }
    }

    return { csvColumn: col, leadField: matchedField || '' }
  })
}

export function CsvImportModal({ open, onClose, onImportComplete }: CsvImportModalProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [rawData, setRawData] = useState<Record<string, string>[]>([])
  const [csvColumns, setCsvColumns] = useState<string[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 })
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)

  const reset = () => {
    setStep('upload')
    setRawData([])
    setCsvColumns([])
    setMappings([])
    setErrors([])
    setImportProgress({ current: 0, total: 0 })
    setImportResult(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const processFile = useCallback(async (file: File) => {
    try {
      const data = await parseCSV(file)
      const columns = Object.keys(data[0] || {})
      setRawData(data)
      setCsvColumns(columns)
      setMappings(autoDetectMapping(columns))
      setStep('preview')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to parse CSV')
    }
  }, [])

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file?.name.endsWith('.csv')) {
        processFile(file)
      } else {
        alert('Please upload a .csv file')
      }
    },
    [processFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleMappingChange = (csvCol: string, leadField: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.csvColumn === csvCol ? { ...m, leadField } : m))
    )
  }

  const handleValidate = () => {
    // Transform data using current mappings
    const transformed = rawData.map((row) => {
      const mapped: Record<string, string> = {}
      mappings.forEach(({ csvColumn, leadField }) => {
        if (leadField) {
          mapped[leadField] = row[csvColumn] || ''
        }
      })
      return mapped
    })

    const { valid, errors: validationErrors } = validateCSVData(transformed)
    setErrors(validationErrors)

    if (validationErrors.length === 0 && valid.length > 0) {
      setStep('importing')
      handleImport(transformed)
    }
  }

  const handleImport = async (data: Record<string, string>[]) => {
    if (!user) return

    setImportProgress({ current: 0, total: data.length })
    let successCount = 0
    let failedCount = 0

    for (let i = 0; i < data.length; i++) {
      try {
        const lead = mapCSVRowToLead(data[i], user.id)
        await leadService.create(lead)
        successCount++
      } catch {
        failedCount++
      }
      setImportProgress({ current: i + 1, total: data.length })
    }

    setImportResult({ success: successCount, failed: failedCount })
    setStep('done')
    onImportComplete()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import Leads from CSV" className="max-w-2xl">
      <div className="space-y-4">
        {/* Step: Upload */}
        {step === 'upload' && (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer',
              isDragging
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="h-10 w-10 mx-auto mb-3 text-secondary" />
            <p className="text-sm font-medium text-primary mb-1">
              Drop your CSV file here or click to browse
            </p>
            <p className="text-xs text-secondary">
              Supports standard CSV files with headers
            </p>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <FileText className="h-4 w-4" />
                {rawData.length} rows detected
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep('mapping')}>
                <ChevronDown className="h-4 w-4 mr-1" /> Edit Column Mapping
              </Button>
            </div>

            {/* Preview table */}
            <div className="border border-border rounded-lg overflow-auto max-h-48">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-background">
                    {csvColumns.map((col) => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-secondary whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {csvColumns.map((col) => (
                        <td key={col} className="px-3 py-2 text-primary whitespace-nowrap">
                          {row[col] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errors.length > 0 && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-danger mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Validation Errors
                </div>
                <div className="max-h-32 overflow-auto space-y-1">
                  {errors.map((err, i) => (
                    <p key={i} className="text-xs text-danger">
                      Row {err.row}: {err.message}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={reset}>
                Start Over
              </Button>
              <Button size="sm" onClick={handleValidate}>
                Validate & Import
              </Button>
            </div>
          </>
        )}

        {/* Step: Mapping */}
        {step === 'mapping' && (
          <>
            <p className="text-sm text-secondary">
              Map CSV columns to lead fields. Required fields are marked with *.
            </p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {mappings.map((m) => (
                <div key={m.csvColumn} className="flex items-center gap-3">
                  <span className="text-sm text-primary w-1/3 truncate" title={m.csvColumn}>
                    {m.csvColumn}
                  </span>
                  <span className="text-secondary">→</span>
                  <select
                    value={m.leadField}
                    onChange={(e) => handleMappingChange(m.csvColumn, e.target.value)}
                    className="flex-1 h-8 rounded-md border border-border bg-background px-2 text-sm text-primary"
                  >
                    <option value="">Skip column</option>
                    {LEAD_FIELDS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}{f.required ? ' *' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setStep('preview')}>
                Back
              </Button>
              <Button size="sm" onClick={() => setStep('preview')}>
                Done
              </Button>
            </div>
          </>
        )}

        {/* Step: Importing */}
        {step === 'importing' && (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 mx-auto text-accent animate-spin" />
            <p className="text-sm text-primary">
              Importing {importProgress.current} of {importProgress.total} leads...
            </p>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && importResult && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-10 w-10 mx-auto text-green-500" />
            <div>
              <p className="text-sm font-medium text-primary">Import Complete</p>
              <p className="text-xs text-secondary mt-1">
                {importResult.success} leads imported
                {importResult.failed > 0 && `, ${importResult.failed} failed`}
              </p>
            </div>
            <Button size="sm" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
