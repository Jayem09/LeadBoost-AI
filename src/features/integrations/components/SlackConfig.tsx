import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Wifi, WifiOff, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useIntegrationStore, type SlackConfig as SlackConfigType } from '../store/useIntegrationStore'

export function SlackConfigComponent() {
  const integration = useIntegrationStore((state) =>
    state.integrations.find((int) => int.id === 'slack')
  )
  const updateConfig = useIntegrationStore((state) => state.updateConfig)
  const setStatus = useIntegrationStore((state) => state.setStatus)
  const setTestResult = useIntegrationStore((state) => state.setTestResult)

  const [testing, setTesting] = useState(false)
  const config = integration?.config as SlackConfigType | undefined

  const handleTest = async () => {
    if (!config?.webhookUrl || !config?.channelName) {
      setTestResult('slack', 'failed')
      return
    }

    setTesting(true)
    setTestResult('slack', null)

    // Simulate sending test message (in real app, this would call webhook)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo: succeed if webhook URL is valid format
    const success = config.webhookUrl.startsWith('https://hooks.slack.com/')

    setTestResult('slack', success ? 'success' : 'failed')
    setStatus('slack', success ? 'connected' : 'disconnected')
    setTesting(false)
  }

  const isConnected = integration?.status === 'connected'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-500" />
          Slack Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        {isConnected ? (
          <div className="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/20 text-success text-sm">
            <Wifi className="h-4 w-4" />
            Connected to Slack
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-md bg-warning/10 border border-warning/20 text-warning text-sm">
            <WifiOff className="h-4 w-4" />
            Not connected
          </div>
        )}

        {/* Config Form */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Webhook URL</label>
            <Input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={config?.webhookUrl || ''}
              onChange={(e) => updateConfig('slack', { webhookUrl: e.target.value })}
            />
            <p className="text-xs text-muted mt-1">
              Create an incoming webhook in your Slack app settings
            </p>
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">Channel Name</label>
            <Input
              placeholder="#lead-notifications"
              value={config?.channelName || ''}
              onChange={(e) => updateConfig('slack', { channelName: e.target.value })}
            />
          </div>
        </div>

        {/* Test Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleTest}
            disabled={testing || !config?.webhookUrl || !config?.channelName}
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending test...
              </>
            ) : (
              'Send Test Message'
            )}
          </Button>

          {integration?.testResult === 'success' && (
            <div className="flex items-center gap-1 text-success text-sm">
              <CheckCircle className="h-4 w-4" />
              Test message sent
            </div>
          )}
          {integration?.testResult === 'failed' && (
            <div className="flex items-center gap-1 text-danger text-sm">
              <XCircle className="h-4 w-4" />
              Failed to send
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
