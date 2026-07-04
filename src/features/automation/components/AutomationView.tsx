import { TopNav } from '@/components/layout/TopNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, Copy, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  getWebhookUrl,
  setWebhookUrl,
  getWebhookEvents,
  setWebhookEvents,
} from '@/lib/webhook'
import { automationService, getWebhookLog, type WebhookLog } from '@/services'

const ALL_EVENTS = ['lead.created', 'lead.status_changed', 'lead.updated', 'lead.deleted']

export function AutomationView() {
  const [url, setUrl] = useState('')
  const [events, setEvents] = useState<string[]>([])
  const [log, setLog] = useState<WebhookLog[]>([])
  const [copied, setCopied] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    setUrl(getWebhookUrl())
    setEvents(getWebhookEvents())
    setLog(getWebhookLog())
  }, [])

  const handleSaveUrl = () => {
    setWebhookUrl(url)
  }

  const handleToggleEvent = (event: string) => {
    const next = events.includes(event) ? events.filter((e) => e !== event) : [...events, event]
    setEvents(next)
    setWebhookEvents(next)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTest = async () => {
    setTesting(true)
    await automationService.sendLeadWebhook('lead.created', {
      name: 'Test Lead',
      email: 'test@example.com',
      company: 'Test Co',
      source: 'Test',
    })
    setLog(getWebhookLog())
    setTesting(false)
  }

  return (
    <div>
      <TopNav title="Automation" subtitle="Connect with n8n and automate your workflows" />

      <div className="p-6 space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Webhook Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-secondary mb-1.5 block">Webhook URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://your-n8n.com/webhook/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 font-mono text-xs"
                />
                <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!url}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleSaveUrl}>
                  Save
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-secondary mb-1.5 block">Events</label>
              <div className="space-y-2">
                {ALL_EVENTS.map((event) => (
                  <label key={event} className="flex items-center gap-2 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={events.includes(event)}
                      onChange={() => handleToggleEvent(event)}
                      className="rounded border-border"
                    />
                    {event}
                  </label>
                ))}
              </div>
            </div>

            <Button size="sm" onClick={handleTest} disabled={!url || testing}>
              <Zap className="h-4 w-4 mr-2" /> {testing ? 'Sending...' : 'Test Webhook'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {log.length === 0 ? (
              <div className="py-8 text-center text-secondary text-sm">
                No webhook activity yet. Configure a URL and test it.
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-card border-b border-border">
                      <th className="text-left py-2 px-4 text-xs font-medium text-secondary">Event</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-secondary">Status</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-secondary">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.map((entry, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2 px-4 text-sm font-mono text-primary">{entry.event}</td>
                        <td className="py-2 px-4">
                          <span className={`text-xs font-medium ${entry.status === 'success' ? 'text-success' : 'text-danger'}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-sm text-secondary">{entry.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
