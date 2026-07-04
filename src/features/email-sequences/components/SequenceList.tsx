import { MoreHorizontal, Play, Pause, Trash2, Edit, Mail } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { useEmailSequenceStore } from '../store/useEmailSequenceStore'
import { formatDate } from '@/lib/utils'
import type { EmailSequence, SequenceStatus } from '@/types'

interface SequenceListProps {
  onEdit: (sequence: EmailSequence) => void
}

const STATUS_CONFIG: Record<SequenceStatus, { label: string; variant: 'default' | 'success' | 'warning' }> = {
  draft: { label: 'Draft', variant: 'default' },
  active: { label: 'Active', variant: 'success' },
  paused: { label: 'Paused', variant: 'warning' },
}

export function SequenceList({ onEdit }: SequenceListProps) {
  const { sequences, loading, deleteSequence, toggleStatus } = useEmailSequenceStore()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Delete this sequence?')) {
      await deleteSequence(id)
    }
    setOpenMenu(null)
  }

  const handleToggleStatus = async (id: string, currentStatus: SequenceStatus) => {
    await toggleStatus(id, currentStatus)
    setOpenMenu(null)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-5 bg-background rounded w-1/3 mb-2" />
              <div className="h-4 bg-background rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (sequences.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="No email sequences"
        description="Create your first email sequence to automate outreach"
      />
    )
  }

  return (
    <div className="space-y-3">
      {sequences.map((sequence) => {
        const statusConfig = STATUS_CONFIG[sequence.status]
        return (
          <Card
            key={sequence.id}
            className="hover:border-accent/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-medium text-primary truncate">
                      {sequence.name}
                    </h3>
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  {sequence.description && (
                    <p className="text-xs text-secondary truncate mb-2">
                      {sequence.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-secondary">
                    <span>{sequence.steps.length} step{sequence.steps.length !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span>Created {formatDate(sequence.createdAt)}</span>
                  </div>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenMenu(openMenu === sequence.id ? null : sequence.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  {openMenu === sequence.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-border bg-card shadow-lg z-10">
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-background"
                        onClick={() => { onEdit(sequence); setOpenMenu(null) }}
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-background"
                        onClick={() => handleToggleStatus(sequence.id, sequence.status)}
                      >
                        {sequence.status === 'active'
                          ? <><Pause className="h-3.5 w-3.5" /> Pause</>
                          : <><Play className="h-3.5 w-3.5" /> Activate</>
                        }
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-background"
                        onClick={() => handleDelete(sequence.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
