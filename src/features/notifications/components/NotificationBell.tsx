import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '../store/useNotificationStore'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import type { NotificationType } from '@/types'

const typeLabels: Record<NotificationType, string> = {
  lead_created: 'New Lead',
  lead_status_changed: 'Status Change',
  task_assigned: 'Task Assigned',
  task_completed: 'Task Done',
  mention: 'Mention',
  system: 'System',
}

const typeBadgeVariant: Record<NotificationType, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  lead_created: 'success',
  lead_status_changed: 'warning',
  task_assigned: 'default',
  task_completed: 'success',
  mention: 'secondary',
  system: 'default',
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, markAsRead, markAllRead } = useNotificationStore()
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)
  const user = useAuthStore((s) => s.user)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleMarkAllRead = () => {
    if (user?.id) markAllRead(user.id)
  }

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="danger"
            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-primary">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs h-7"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-7 w-7 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-secondary">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
                    !n.read ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant={typeBadgeVariant[n.type]} className="text-[10px]">
                          {typeLabels[n.type]}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-primary truncate">{n.title}</p>
                      <p className="text-xs text-secondary truncate">{n.message}</p>
                      <p className="text-[10px] text-muted mt-1">
                        {formatTimeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
