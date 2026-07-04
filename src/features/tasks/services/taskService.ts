import { supabase } from '@/lib/supabase'
import type { Task } from '@/types'

const TABLE = 'tasks'

export const taskService = {
  subscribe: (userId: string, callback: (tasks: Task[]) => void) => {
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE, filter: `user_id=eq.${userId}` },
        async () => {
          const { data } = await supabase
            .from(TABLE)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
          callback(data || [])
        }
      )
      .subscribe()

    // Initial fetch
    supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => callback(data || []))

    return () => {
      supabase.removeChannel(channel)
    }
  },

  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  getByLeadId: async (leadId: string) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  getMyTasks: async (userId: string) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('assigned_to', userId)
      .order('due_date', { ascending: true })
    if (error) throw error
    return data
  },

  create: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.dueDate,
        assigned_to: task.assignedTo,
        lead_id: task.leadId,
        user_id: task.userId,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  update: async (id: string, data: Partial<Task>) => {
    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate
    if (data.assignedTo !== undefined) updateData.assigned_to = data.assignedTo
    if (data.leadId !== undefined) updateData.lead_id = data.leadId

    updateData.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
    if (error) throw error
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
