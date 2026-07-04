import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTaskStore } from '../store/useTaskStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { TASK_STATUS_LABELS } from '@/lib/constants'
import type { Task, TaskStatus } from '@/types'

interface TaskFormProps {
  open: boolean
  onClose: () => void
  task?: Task | null
  leadId?: string | null
}

export function TaskForm({ open, onClose, task, leadId }: TaskFormProps) {
  const { createTask, updateTask } = useTaskStore()
  const { user } = useAuth()
  const isEditing = !!task

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    assignedTo: task?.assignedTo || user?.id || '',
    status: task?.status || 'pending' as TaskStatus,
    leadId: task?.leadId || leadId || '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (isEditing) {
        await updateTask(task.id, {
          title: form.title,
          description: form.description,
          dueDate: form.dueDate,
          assignedTo: form.assignedTo,
          status: form.status,
          leadId: form.leadId || null,
        })
      } else {
        await createTask({
          title: form.title,
          description: form.description,
          dueDate: form.dueDate,
          assignedTo: form.assignedTo,
          status: form.status,
          leadId: form.leadId || null,
          userId: user?.id || '',
        })
      }
      onClose()
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label className="text-sm text-secondary mb-1.5 block">Title *</label>
          <Input
            required
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-secondary mb-1.5 block">Description</label>
          <textarea
            placeholder="Task description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Due Date *</label>
            <Input
              required
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary"
            >
              {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
                <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{isEditing ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  )
}
