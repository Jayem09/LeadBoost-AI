import { create } from 'zustand'
import type { CustomField, CustomFieldValue, CustomFieldType } from '@/types'
import { supabase } from '@/lib/supabase'

interface CustomFieldStore {
  fields: CustomField[]
  values: CustomFieldValue[]
  loading: boolean
  fetchFields: () => Promise<void>
  createField: (name: string, type: CustomFieldType, options?: string[]) => Promise<void>
  deleteField: (id: string) => Promise<void>
  fetchValues: (leadId: string) => Promise<void>
  upsertValue: (leadId: string, fieldId: string, value: string) => Promise<void>
}

export const useCustomFieldStore = create<CustomFieldStore>()((set) => ({
  fields: [],
  values: [],
  loading: false,

  fetchFields: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      set({
        fields: (data || []).map((f: Record<string, unknown>) => ({
          id: f.id as string,
          name: f.name as string,
          type: f.type as CustomFieldType,
          options: f.options as string[] | null,
          userId: f.user_id as string,
          createdAt: new Date(f.created_at as string),
        })),
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch custom fields:', error)
      set({ loading: false })
    }
  },

  createField: async (name, type, options) => {
    try {
      const insertData: Record<string, unknown> = { name, type }
      if (type === 'select' && options) {
        insertData.options = options
      }
      const { data, error } = await supabase
        .from('custom_fields')
        .insert(insertData)
        .select()
        .single()
      if (error) throw error
      set((state) => ({
        fields: [
          ...state.fields,
          {
            id: data.id as string,
            name: data.name as string,
            type: data.type as CustomFieldType,
            options: data.options as string[] | null,
            userId: data.user_id as string,
            createdAt: new Date(data.created_at as string),
          },
        ],
      }))
    } catch (error) {
      console.error('Failed to create custom field:', error)
      throw error
    }
  },

  deleteField: async (id) => {
    try {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id)
      if (error) throw error
      // Also delete associated values
      await supabase
        .from('custom_field_values')
        .delete()
        .eq('field_id', id)
      set((state) => ({
        fields: state.fields.filter((f) => f.id !== id),
        values: state.values.filter((v) => v.fieldId !== id),
      }))
    } catch (error) {
      console.error('Failed to delete custom field:', error)
      throw error
    }
  },

  fetchValues: async (leadId) => {
    try {
      const { data, error } = await supabase
        .from('custom_field_values')
        .select('*')
        .eq('lead_id', leadId)
      if (error) throw error
      set({
        values: (data || []).map((v: Record<string, unknown>) => ({
          id: v.id as string,
          leadId: v.lead_id as string,
          fieldId: v.field_id as string,
          value: v.value as string,
          createdAt: new Date(v.created_at as string),
        })),
      })
    } catch (error) {
      console.error('Failed to fetch custom field values:', error)
    }
  },

  upsertValue: async (leadId, fieldId, value) => {
    try {
      const { data: existing } = await supabase
        .from('custom_field_values')
        .select('id')
        .eq('lead_id', leadId)
        .eq('field_id', fieldId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('custom_field_values')
          .update({ value })
          .eq('id', existing.id)
        if (error) throw error
        set((state) => ({
          values: state.values.map((v) =>
            v.leadId === leadId && v.fieldId === fieldId ? { ...v, value } : v
          ),
        }))
      } else {
        const { data, error } = await supabase
          .from('custom_field_values')
          .insert({ lead_id: leadId, field_id: fieldId, value })
          .select()
          .single()
        if (error) throw error
        set((state) => ({
          values: [
            ...state.values,
            {
              id: data.id as string,
              leadId: data.lead_id as string,
              fieldId: data.field_id as string,
              value: data.value as string,
              createdAt: new Date(data.created_at as string),
            },
          ],
        }))
      }
    } catch (error) {
      console.error('Failed to upsert custom field value:', error)
      throw error
    }
  },
}))
