import { useState, useEffect } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { useTaskStore } from '../store/useTaskStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { taskService } from '../services/taskService'
import { TASK_STATUS_LABELS } from '@/lib/constants'
import { Plus, CheckSquare } from 'lucide-react'
import type { Task, TaskStatus } from '@/types'

export function TasksView() {
  const { user } = useAuth()
  const { tasks, loading, statusFilter, setStatusFilter, fetchTasks, setTasks, updateTask, deleteTask } = useTaskStore()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    if (!user) return

    fetchTasks()

    const unsubscribe = taskService.subscribe(user.id, (tasks) => {
      setTasks(tasks)
    })

    return () => unsubscribe()
  }, [user, fetchTasks, setTasks])

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesStatus
  })

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status })
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      await deleteTask(id)
    }
  }

  return (
    <div>
      <TopNav title="Tasks" subtitle="Manage and track all your tasks" />

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm text-primary"
          >
            <option value="all">All Status</option>
            {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
            ))}
          </select>
          <Button size="sm" onClick={() => { setEditingTask(null); setShowForm(true) }}>
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks found" description="Create your first task to get started" />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <TaskForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null) }}
        task={editingTask}
      />
    </div>
  )
}
