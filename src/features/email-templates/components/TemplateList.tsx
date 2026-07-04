import { useEffect, useState } from 'react'
import { useEmailTemplateStore } from '../store/useEmailTemplateStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit, Mail, X } from 'lucide-react'

export function TemplateList() {
  const { templates, loading, fetchTemplates, deleteTemplate } = useEmailTemplateStore()
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  if (loading) return <div className="text-sm text-secondary py-4">Loading templates...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">{templates.length} Templates</h3>
        <Button size="sm" onClick={() => { setEditingTemplate(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-1" /> New Template
        </Button>
      </div>

      {showForm && (
        <TemplateForm
          editingId={editingTemplate}
          onClose={() => { setShowForm(false); setEditingTemplate(null) }}
        />
      )}

      {templates.length === 0 ? (
        <div className="text-center py-8 text-secondary text-sm">
          <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
          No templates yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((t) => (
            <Card key={t.id} className="hover:border-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-primary">{t.name}</h4>
                    <p className="text-xs text-secondary mt-0.5">Subject: {t.subject}</p>
                    <p className="text-xs text-secondary mt-1 line-clamp-2">{t.body}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingTemplate(t.id); setShowForm(true) }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTemplate(t.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function TemplateForm({ editingId, onClose }: { editingId: string | null; onClose: () => void }) {
  const { templates, createTemplate, updateTemplate } = useEmailTemplateStore()
  const existing = editingId ? templates.find((t) => t.id === editingId) : null
  const [name, setName] = useState(existing?.name || '')
  const [subject, setSubject] = useState(existing?.subject || '')
  const [body, setBody] = useState(existing?.body || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name || !subject || !body) return
    setSaving(true)
    if (editingId) {
      await updateTemplate(editingId, { name, subject, body })
    } else {
      await createTemplate(name, subject, body)
    }
    setSaving(false)
    onClose()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{editingId ? 'Edit Template' : 'New Template'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Template name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Subject line" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea
          className="w-full min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Email body... Use {{lead.name}}, {{lead.email}}, {{lead.company}} for variables"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !name || !subject || !body}>
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
