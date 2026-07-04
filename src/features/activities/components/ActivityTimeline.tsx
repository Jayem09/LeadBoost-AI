import { useEffect } from 'react'
import { useActivityStore } from '../store/useActivityStore'
import { formatTimeAgo } from '@/lib/utils'
import type { ActivityType } from '@/types'
import {
  Phone,
  Mail,
  CalendarDays,
  StickyNote,
  ArrowRightLeft,
  Tag,
  Settings2,
  Plus,
} from 'lucide-react'

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: typeof Phone; color: string; bg: string; label: string }
> = {
  call: {
    icon: Phone,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    label: 'Call',
  },
  email: {
    icon: Mail,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    label: 'Email',
  },
  meeting: {
    icon: CalendarDays,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    label: 'Meeting',
  },
  note: {
    icon: StickyNote,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    label: 'Note',
  },
  status_change: {
    icon: ArrowRightLeft,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
    label: 'Status Change',
  },
  tag_added: {
    icon: Tag,
    color: 'text-pink-600',
    bg: 'bg-pink-100',
    label: 'Tag Added',
  },
  custom_field_updated: {
    icon: Settings2,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    label: 'Field Updated',
  },
  created: {
    icon: Plus,
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Created',
  },
}

interface ActivityTimelineProps {
  leadId: string
}

export function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const { activities, loading, fetchActivities } = useActivityStore()

  useEffect(() => {
    fetchActivities(leadId)
  }, [leadId, fetchActivities])

  if (loading && activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-accent" />
        <p className="mt-2 text-sm text-secondary">Loading activities...</p>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Plus className="h-5 w-5 text-secondary" />
        </div>
        <p className="text-sm text-secondary">No activities yet.</p>
        <p className="text-xs text-secondary mt-1">
          Log a call, email, or meeting to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-0">
        {activities.map((activity, index) => {
          const config = ACTIVITY_CONFIG[activity.type]
          const Icon = config.icon

          return (
            <div key={activity.id} className="relative flex gap-3 py-3">
              {/* Icon circle */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background ${config.bg}`}
              >
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm text-primary leading-snug">
                  {activity.description}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-xs text-secondary">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
