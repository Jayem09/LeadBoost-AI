import { supabase } from '@/lib/supabase'
import type { EmailSequence, SequenceStatus } from '@/types'

const TABLE = 'email_sequences'

export const emailSequenceService = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  create: async (sequence: Omit<EmailSequence, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: sequence.name,
        description: sequence.description,
        status: sequence.status,
        steps: sequence.steps,
        user_id: sequence.userId,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  update: async (id: string, data: Partial<EmailSequence>) => {
    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.steps !== undefined) updateData.steps = data.steps

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

  updateStatus: async (id: string, status: SequenceStatus) => {
    const { error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },
}
