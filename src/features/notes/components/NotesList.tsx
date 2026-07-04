import { useEffect, useState } from 'react'
import { useNoteStore } from '../store/useNoteStore'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, Trash2 } from 'lucide-react'

interface NotesListProps {
  leadId: string
}

export function NotesList({ leadId }: NotesListProps) {
  const { notes, loading, error, fetchNotes, addNote, deleteNote } = useNoteStore()
  const { user } = useAuthStore()
  const [newNote, setNewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchNotes(leadId)
  }, [leadId, fetchNotes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newNote.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      await addNote(leadId, trimmed)
      setNewNote('')
    } catch {
      // error is set in store
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    await deleteNote(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add note form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 h-10 rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          />
          <Button type="submit" size="sm" disabled={submitting || !newNote.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-secondary text-center py-4">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-secondary mt-1">{new Date(note.created_at).toLocaleDateString()}</p>
                </div>
                {user && note.created_by === user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    className="shrink-0 text-secondary hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
