import { create } from 'zustand'
import type { Task, TaskStatus } from '@/types'
import { taskService } from '../services/taskService'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  statusFilter: TaskStatus | 'all'
  setStatusFilter: (status: TaskStatus | 'all') => void
  fetchTasks: (leadId?: string) => Promise<void>
  fetchMyTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  loading: false,
  statusFilter: 'all',

  setStatusFilter: (statusFilter) => set({ statusFilter }),

  setTasks: (tasks) => set({ tasks, loading: false }),

  fetchTasks: async (leadId?: string) => {
    set({ loading: true })
    try {
      const tasks = leadId
        ? await taskService.getByLeadId(leadId)
        : await taskService.getAll(get().tasks[0]?.userId || '')
      set({ tasks: tasks as Task[], loading: false })
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      set({ loading: false })
    }
  },

  fetchMyTasks: async () => {
    set({ loading: true })
    try {
      const tasks = await taskService.getMyTasks(get().tasks[0]?.userId || '')
      set({ tasks: tasks as Task[], loading: false })
    } catch (error) {
      console.error('Failed to fetch my tasks:', error)
      set({ loading: false })
    }
  },

  createTask: async (task) => {
    try {
      const created = await taskService.create(task)
      set((state) => ({ tasks: [created as Task, ...state.tasks] }))
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  },

  updateTask: async (id, data) => {
    try {
      await taskService.update(id, data)
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date() } : t)),
      }))
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await taskService.delete(id)
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    }
  },
}))
