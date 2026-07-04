import { useState } from 'react'
import { Plus, Trash2, GripVertical, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { SequenceStep } from '@/types'

interface SequenceBuilderProps {
  initialSteps?: SequenceStep[]
  onSave: (steps: SequenceStep[]) => void
  onCancel: () => void
}

const TRIGGER_CONDITIONS = [
  { value: 'enrolled', label: 'When lead is enrolled' },
  { value: 'opened_previous', label: 'When previous email opened' },
  { value: 'clicked_previous', label: 'When previous email clicked' },
  { value: 'replied_previous', label: 'When previous email replied' },
  { value: 'no_reply', label: 'When no reply to previous' },
]

const EMAIL_TEMPLATES = [
  { id: 'welcome', name: 'Welcome Email' },
  { id: 'followup-1', name: 'Follow-up #1' },
  { id: 'followup-2', name: 'Follow-up #2' },
  { id: 'followup-3', name: 'Follow-up #3' },
  { id: 'breakup', name: 'Breakup Email' },
  { id: 'case-study', name: 'Case Study' },
  { id: 'custom', name: 'Custom Template' },
]

export function SequenceBuilder({ initialSteps = [], onSave, onCancel }: SequenceBuilderProps) {
  const [steps, setSteps] = useState<SequenceStep[]>(
    initialSteps.length > 0
      ? initialSteps
      : [{ id: crypto.randomUUID(), order: 0, delayDays: 0, templateId: null, triggerCondition: 'enrolled' }]
  )

  const addStep = () => {
    const newStep: SequenceStep = {
      id: crypto.randomUUID(),
      order: steps.length,
      delayDays: 1,
      templateId: null,
      triggerCondition: 'opened_previous',
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (stepId: string) => {
    if (steps.length <= 1) return
    setSteps(steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i })))
  }

  const updateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)))
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const idx = steps.findIndex((s) => s.id === stepId)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === steps.length - 1)) return

    const newSteps = [...steps]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    const temp = newSteps[idx]
    newSteps[idx] = newSteps[targetIdx]
    newSteps[targetIdx] = temp
    setSteps(newSteps.map((s, i) => ({ ...s, order: i })))
  }

  const canSave = steps.every((s) => s.templateId !== null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-primary">Sequence Steps</h3>
        <span className="text-xs text-secondary">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id}>
            {index > 0 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-secondary" />
              </div>
            )}
            <Card className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      className="text-secondary hover:text-primary disabled:opacity-30"
                    >
                      <GripVertical className="h-3 w-3 rotate-180" />
                    </button>
                    <span className="text-xs font-medium text-accent">{index + 1}</span>
                    <button
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                      className="text-secondary hover:text-primary disabled:opacity-30"
                    >
                      <GripVertical className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-secondary mb-1">Delay (days)</label>
                        <Input
                          type="number"
                          min={0}
                          max={365}
                          value={step.delayDays}
                          onChange={(e) => updateStep(step.id, { delayDays: parseInt(e.target.value) || 0 })}
                          className="h-9 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-secondary mb-1">Template</label>
                        <select
                          value={step.templateId ?? ''}
                          onChange={(e) => updateStep(step.id, { templateId: e.target.value || null })}
                          className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <option value="">Select template...</option>
                          {EMAIL_TEMPLATES.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-secondary mb-1">Trigger</label>
                        <select
                          value={step.triggerCondition}
                          onChange={(e) => updateStep(step.id, { triggerCondition: e.target.value })}
                          className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          {TRIGGER_CONDITIONS.map((tc) => (
                            <option key={tc.value} value={tc.value}>{tc.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length <= 1}
                    className="text-secondary hover:text-danger disabled:opacity-30 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Button variant="secondary" size="sm" onClick={addStep}>
        <Plus className="h-4 w-4 mr-1" /> Add Step
      </Button>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(steps)} disabled={!canSave}>
          Save Sequence
        </Button>
      </div>
    </div>
  )
}
