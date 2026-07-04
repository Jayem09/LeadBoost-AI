import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCustomFieldStore } from '../store/useCustomFieldStore'
import { Plus, Trash2, Settings2 } from 'lucide-react'
import type { CustomFieldType } from '@/types'

const FIELD_TYPE_OPTIONS: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
]

export function CustomFieldManager() {
  const { fields, loading, fetchFields, createField, deleteField } = useCustomFieldStore()
  const [name, setName] = useState('')
  const [type, setType] = useState<CustomFieldType>('text')
  const [options, setOptions] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch fields on mount
  useEffect(() => {
    fetchFields()
  }, [fetchFields])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      const parsedOptions = type === 'select'
        ? options.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined
      await createField(name.trim(), type, parsedOptions)
      setName('')
      setType('text')
      setOptions('')
    } catch {
      // Error handled in store
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, fieldName: string) => {
    if (confirm(`Delete custom field "${fieldName}"? This will remove all values for this field.`)) {
      await deleteField(id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Custom Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing fields list */}
        {loading ? (
          <p className="text-sm text-secondary">Loading fields...</p>
        ) : fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">{field.name}</span>
                  <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent capitalize">
                    {field.type}
                  </span>
                  {field.type === 'select' && field.options && (
                    <span className="text-xs text-secondary">
                      ({field.options.length} options)
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(field.id, field.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-secondary">No custom fields yet. Add one below.</p>
        )}

        {/* Add new field form */}
        <form onSubmit={handleAdd} className="border-t border-border pt-4 space-y-3">
          <h4 className="text-sm font-medium text-primary">Add New Field</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-secondary mb-1 block">Field Name</label>
              <Input
                placeholder="e.g. Lead Source Detail"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-secondary mb-1 block">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CustomFieldType)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
              >
                {FIELD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {type === 'select' && (
            <div>
              <label className="text-xs text-secondary mb-1 block">Options (comma separated)</label>
              <Input
                placeholder="Option 1, Option 2, Option 3"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" size="sm" disabled={submitting || !name.trim()}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {submitting ? 'Adding...' : 'Add Field'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
