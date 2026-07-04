import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/lib/constants'
import { Check, Clock, AlertCircle } from 'lucide-react'
import type { Task, TaskStatus } from '@/types'

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onStatusChange, onEdit, onDelete }: TaskListProps) {
  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const getDueDateColor = (task: Task) => {
    if (task.status === 'completed') return 'text-success'
    if (isOverdue(task.dueDate)) return 'text-danger'
    return 'text-secondary'
  }

  const handleToggleComplete = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed'
    onStatusChange(task.id, newStatus)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-10 w-10 text-secondary mx-auto mb-3" />
        <p className="text-sm text-secondary">No tasks yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
        >
          <button
            onClick={() => handleToggleComplete(task)}
            className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.status === 'completed'
                ? 'bg-success border-success text-white'
                : 'border-border hover:border-accent'
            }`}
          >
            {task.status === 'completed' && <Check className="h-3 w-3" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`text-sm font-medium text-primary ${
                task.status === 'completed' ? 'line-through opacity-60' : ''
              }`}>
                {task.title}
              </h4>
              <Badge variant={TASK_STATUS_COLORS[task.status] as 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'}>
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
            </div>

            {task.description && (
              <p className="text-xs text-secondary mb-1 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center gap-3 mt-2">
              {task.dueDate && (
                <span className={`text-xs flex items-center gap-1 ${getDueDateColor(task)}`}>
                  {isOverdue(task.dueDate) && task.status !== 'completed' && (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  Due: {formatDate(new Date(task.dueDate))}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
