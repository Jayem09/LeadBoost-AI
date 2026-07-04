import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Notification, NotificationType } from '@/types'

interface NotificationStore {
  notifications: Notification[]
  loading: boolean
  fetchNotifications: (userId: string) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllRead: (userId: string) => Promise<void>
  addNotification: (type: NotificationType, title: string, message: string, userId: string) => Promise<void>
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async (userId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .limit(50)

      if (error) throw error

      const notifications = (data ?? []).map((n) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }))

      set({ notifications, loading: false })
    } catch (error) {
      console.error('[Notifications] Failed to fetch:', error)
      set({ loading: false })
    }
  },

  markAsRead: async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }))
    } catch (error) {
      console.error('[Notifications] Failed to mark as read:', error)
    }
  },

  markAllRead: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('userId', userId)
        .eq('read', false)

      if (error) throw error

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }))
    } catch (error) {
      console.error('[Notifications] Failed to mark all as read:', error)
    }
  },

  addNotification: async (type: NotificationType, title: string, message: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({ type, title, message, userId, read: false })
        .select()
        .single()

      if (error) throw error

      const notification: Notification = {
        ...data,
        createdAt: new Date(data.createdAt),
      }

      set((state) => ({
        notifications: [notification, ...state.notifications],
      }))
    } catch (error) {
      console.error('[Notifications] Failed to add:', error)
    }
  },
}))
