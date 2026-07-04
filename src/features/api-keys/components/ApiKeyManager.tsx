import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { useApiKeyStore } from '../store/useApiKeyStore'
import { Plus, Trash2, KeyRound, Copy, Check, Eye, EyeOff } from 'lucide-react'

export function ApiKeyManager() {
  const { apiKeys, loading, fetchKeys, createKey, deleteKey } = useApiKeyStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    setSubmitting(true)
    try {
      const fullKey = await createKey(newKeyName.trim())
      setCreatedKey(fullKey)
      setNewKeyName('')
    } catch {
      // Error handled in store
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopy = async () => {
    if (!createdKey) return
    await navigator.clipboard.writeText(createdKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete API key "${name}"? This cannot be undone.`)) {
      await deleteKey(id)
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setCreatedKey(null)
    setNewKeyName('')
    setShowKey(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-secondary">Loading API keys...</p>
          ) : apiKeys.length > 0 ? (
            <div className="space-y-2">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">{apiKey.name}</span>
                    <Badge variant="secondary">••••{apiKey.keyPrefix}</Badge>
                    {apiKey.lastUsedAt ? (
                      <span className="text-xs text-secondary">
                        Last used {apiKey.lastUsedAt.toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-xs text-secondary">Never used</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(apiKey.id, apiKey.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">No API keys yet. Create one to get started.</p>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create API Key
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={showCreateModal}
        onClose={handleCloseModal}
        title={createdKey ? 'API Key Created' : 'Create API Key'}
      >
        {createdKey ? (
          <div className="space-y-4">
            <p className="text-sm text-secondary">
              Copy your API key now. You won't be able to see it again.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
              <code className="flex-1 text-sm text-primary font-mono break-all">
                {showKey ? createdKey : `${createdKey.slice(0, 12)}${'•'.repeat(24)}`}
              </code>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-secondary hover:text-primary shrink-0"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="text-secondary hover:text-primary shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCloseModal}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm text-secondary mb-1.5 block">Key Name</label>
              <Input
                placeholder="e.g. Production API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !newKeyName.trim()}>
                {submitting ? 'Creating...' : 'Create Key'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
