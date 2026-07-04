import { useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { useCustomFieldStore } from '../store/useCustomFieldStore'
import type { CustomField } from '@/types'

interface CustomFieldFormProps {
  leadId: string
  fields: CustomField[]
}

export function CustomFieldForm({ leadId, fields }: CustomFieldFormProps) {
  const { values, fetchValues, upsertValue } = useCustomFieldStore()

  useEffect(() => {
    if (leadId) {
      fetchValues(leadId)
    }
  }, [leadId, fetchValues])

  const getValue = useCallback(
    (fieldId: string) => values.find((v) => v.fieldId === fieldId)?.value || '',
    [values]
  )

  const handleChange = useCallback(
    (fieldId: string, value: string) => {
      upsertValue(leadId, fieldId, value)
    },
    [leadId, upsertValue]
  )

  if (fields.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const currentValue = getValue(field.id)

        switch (field.type) {
          case 'text':
            return (
              <div key={field.id}>
                <label className="text-sm text-secondary mb-1.5 block">{field.name}</label>
                <Input
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                  value={currentValue}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            )

          case 'number':
            return (
              <div key={field.id}>
                <label className="text-sm text-secondary mb-1.5 block">{field.name}</label>
                <Input
                  type="number"
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                  value={currentValue}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            )

          case 'select':
            return (
              <div key={field.id}>
                <label className="text-sm text-secondary mb-1.5 block">{field.name}</label>
                <select
                  value={currentValue}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )

          case 'date':
            return (
              <div key={field.id}>
                <label className="text-sm text-secondary mb-1.5 block">{field.name}</label>
                <Input
                  type="date"
                  value={currentValue}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            )

          case 'checkbox':
            return (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentValue === 'true'}
                  onChange={(e) => handleChange(field.id, e.target.checked ? 'true' : 'false')}
                  className="h-4 w-4 rounded border-border bg-background text-accent focus:ring-accent"
                />
                <label className="text-sm text-primary">{field.name}</label>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
