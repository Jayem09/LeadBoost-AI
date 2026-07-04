import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Link, Copy, Check } from 'lucide-react'
import { useIntegrationStore, type CalendarConfig as CalendarConfigType } from '../store/useIntegrationStore'

export function CalendarConfigComponent() {
  const integration = useIntegrationStore((state) =>
    state.integrations.find((int) => int.id === 'calendar')
  )
  const updateConfig = useIntegrationStore((state) => state.updateConfig)
  const setStatus = useIntegrationStore((state) => state.setStatus)

  const [copied, setCopied] = useState<'google' | 'outlook' | null>(null)
  const config = integration?.config as CalendarConfigType | undefined

  const generatedLinks = useMemo(() => {
    if (!config) return { google: '', outlook: '' }

    const params = new URLSearchParams({
      leadName: '{{lead_name}}',
      leadEmail: '{{lead_email}}',
      company: '{{company}}',
    })

    return {
      google: config.googleCalendarLink
        ? `${config.googleCalendarLink}?${params.toString()}`
        : '',
      outlook: config.outlookCalendarLink
        ? `${config.outlookCalendarLink}?${params.toString()}`
        : '',
    }
  }, [config])

  const handleCopy = async (type: 'google' | 'outlook') => {
    const link = generatedLinks[type]
    if (!link) return

    await navigator.clipboard.writeText(link)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const hasConfig = config?.googleCalendarLink || config?.outlookCalendarLink

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Banner */}
        <div className="flex items-center gap-2 p-3 rounded-md bg-info/10 border border-info/20 text-info text-sm">
          <Link className="h-4 w-4" />
          Add your calendar links to generate "Schedule Meeting" links for leads
        </div>

        {/* Config Form */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Google Calendar Link</label>
            <Input
              type="url"
              placeholder="https://calendar.google.com/calendar/r/eventedit?..."
              value={config?.googleCalendarLink || ''}
              onChange={(e) => updateConfig('calendar', { googleCalendarLink: e.target.value })}
            />
            <p className="text-xs text-muted mt-1">
              Create an event in Google Calendar and copy the link
            </p>
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Outlook Calendar Link</label>
            <Input
              type="url"
              placeholder="https://outlook.live.com/calendar/0/deeplink/compose?..."
              value={config?.outlookCalendarLink || ''}
              onChange={(e) => updateConfig('calendar', { outlookCalendarLink: e.target.value })}
            />
          </div>
        </div>

        {/* Auto-connect when links are added */}
        {hasConfig && integration?.status === 'disconnected' && (
          <Button
            variant="secondary"
            onClick={() => setStatus('calendar', 'connected')}
          >
            Enable Calendar Links
          </Button>
        )}

        {/* Generated Links Preview */}
        {hasConfig && (
          <div className="space-y-2">
            <label className="text-sm text-secondary block">Generated Schedule Links</label>

            {generatedLinks.google && (
              <div className="flex items-center gap-2 p-2 bg-background rounded-md border border-border">
                <span className="text-xs text-muted flex-1 truncate">{generatedLinks.google}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('google')}
                  className="h-7 px-2"
                >
                  {copied === 'google' ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}

            {generatedLinks.outlook && (
              <div className="flex items-center gap-2 p-2 bg-background rounded-md border border-border">
                <span className="text-xs text-muted flex-1 truncate">{generatedLinks.outlook}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('outlook')}
                  className="h-7 px-2"
                >
                  {copied === 'outlook' ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
