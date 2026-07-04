import { useState, useEffect } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { SequenceList } from './SequenceList'
import { SequenceBuilder } from './SequenceBuilder'
import { useEmailSequenceStore } from '../store/useEmailSequenceStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Plus } from 'lucide-react'
import type { EmailSequence, SequenceStep } from '@/types'

export function EmailSequencesView() {
  const { user } = useAuth()
  const { sequences, fetchSequences, createSequence, updateSequence } = useEmailSequenceStore()

  const [showBuilder, setShowBuilder] = useState(false)
  const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null)
  const [sequenceName, setSequenceName] = useState('')
  const [sequenceDescription, setSequenceDescription] = useState('')

  useEffect(() => {
    if (user) fetchSequences(user.id)
  }, [user, fetchSequences])

  const handleEdit = (sequence: EmailSequence) => {
    setEditingSequence(sequence)
    setSequenceName(sequence.name)
    setSequenceDescription(sequence.description)
    setShowBuilder(true)
  }

  const handleNewSequence = () => {
    setEditingSequence(null)
    setSequenceName('')
    setSequenceDescription('')
    setShowBuilder(true)
  }

  const handleSaveSteps = async (steps: SequenceStep[]) => {
    if (!user) return

    const commonData = {
      name: sequenceName || 'Untitled Sequence',
      description: sequenceDescription,
      userId: user.id,
    }

    if (editingSequence) {
      await updateSequence(editingSequence.id, {
        ...commonData,
        steps,
      })
    } else {
      await createSequence({
        ...commonData,
        status: 'draft',
        steps,
      })
    }

    setShowBuilder(false)
    setEditingSequence(null)
    setSequenceName('')
    setSequenceDescription('')
  }

  return (
    <div>
      <TopNav
        title="Email Sequences"
        subtitle="Automate your email outreach with multi-step sequences"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-secondary">
              {sequences.length} sequence{sequences.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={handleNewSequence}>
            <Plus className="h-4 w-4 mr-1" /> New Sequence
          </Button>
        </div>

        <SequenceList onEdit={handleEdit} />
      </div>

      <Modal
        open={showBuilder}
        onClose={() => { setShowBuilder(false); setEditingSequence(null) }}
        title={editingSequence ? 'Edit Sequence' : 'New Sequence'}
        className="max-w-2xl"
      >
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-secondary mb-1">Sequence Name</label>
            <Input
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              placeholder="e.g. Cold Outreach Follow-up"
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1">Description (optional)</label>
            <Input
              value={sequenceDescription}
              onChange={(e) => setSequenceDescription(e.target.value)}
              placeholder="What this sequence does..."
            />
          </div>
        </div>

        <SequenceBuilder
          initialSteps={editingSequence?.steps}
          onSave={handleSaveSteps}
          onCancel={() => { setShowBuilder(false); setEditingSequence(null) }}
        />
      </Modal>
    </div>
  )
}
