import { TopNav } from '@/components/layout/TopNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, ExternalLink, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const activityLogs = [
  { event: 'lead.created', status: 'success', time: '2 min ago' },
  { event: 'lead.status_changed', status: 'success', time: '15 min ago' },
  { event: 'lead.updated', status: 'failed', time: '1h ago' },
  { event: 'lead.created', status: 'success', time: '2h ago' },
]

export function AutomationView() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('https://n8n.leadboost.ai/webhook/lead-boost-abc123')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                  readOnly
                  value="https://n8n.leadboost.ai/webhook/lead-boost-abc123"
                  className="flex-1 font-mono text-xs"
                />
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="secondary" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-secondary mb-1.5 block">Events</label>
              <div className="space-y-2">
                {['Lead Created', 'Status Changed', 'Lead Updated', 'Lead Deleted'].map((event) => (
                  <label key={event} className="flex items-center gap-2 text-sm text-primary">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    {event}
                  </label>
                ))}
              </div>
            </div>

            <Button size="sm">
              <Zap className="h-4 w-4 mr-2" /> Test Webhook
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {activityLogs.map((log, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 px-4 text-sm font-mono text-primary">{log.event}</td>
                      <td className="py-2 px-4">
                        <span className={`text-xs font-medium ${log.status === 'success' ? 'text-success' : 'text-danger'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm text-secondary">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
