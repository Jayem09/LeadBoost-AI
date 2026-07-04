import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Wifi, WifiOff, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useIntegrationStore, type GmailConfig as GmailConfigType } from '../store/useIntegrationStore'

export function GmailConfigComponent() {
  const integration = useIntegrationStore((state) =>
    state.integrations.find((int) => int.id === 'gmail')
  )
  const updateConfig = useIntegrationStore((state) => state.updateConfig)
  const setStatus = useIntegrationStore((state) => state.setStatus)
  const setTestResult = useIntegrationStore((state) => state.setTestResult)

  const [testing, setTesting] = useState(false)
  const config = integration?.config as GmailConfigType | undefined

  const handleTest = async () => {
    if (!config?.senderEmail || !config?.appPassword) {
      setTestResult('gmail', 'failed')
      return
    }

    setTesting(true)
    setTestResult('gmail', null)

    // Simulate connection test (in real app, this would call backend)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo: succeed if email contains @ and password is 10+ chars
    const success = config.senderEmail.includes('@') && config.appPassword.length >= 10

    setTestResult('gmail', success ? 'success' : 'failed')
    setStatus('gmail', success ? 'connected' : 'disconnected')
    setTesting(false)
  }

  const isConnected = integration?.status === 'connected'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-red-500" />
          Gmail Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        {isConnected ? (
          <div className="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/20 text-success text-sm">
            <Wifi className="h-4 w-4" />
            Connected to Gmail
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
            <label className="text-sm text-secondary mb-1.5 block">Sender Email</label>
            <Input
              type="email"
              placeholder="your-email@gmail.com"
              value={config?.senderEmail || ''}
              onChange={(e) => updateConfig('gmail', { senderEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1.5 block">App Password</label>
            <Input
              type="password"
              placeholder="Enter your Gmail app password"
              value={config?.appPassword || ''}
              onChange={(e) => updateConfig('gmail', { appPassword: e.target.value })}
            />
            <p className="text-xs text-muted mt-1">
              Generate an app password in your Google Account settings
            </p>
          </div>
        </div>

        {/* Test Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleTest}
            disabled={testing || !config?.senderEmail || !config?.appPassword}
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>

          {integration?.testResult === 'success' && (
            <div className="flex items-center gap-1 text-success text-sm">
              <CheckCircle className="h-4 w-4" />
              Connection successful
            </div>
          )}
          {integration?.testResult === 'failed' && (
            <div className="flex items-center gap-1 text-danger text-sm">
              <XCircle className="h-4 w-4" />
              Connection failed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
