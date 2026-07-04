import { TopNav } from '@/components/layout/TopNav'
import { useIntegrationStore } from '../store/useIntegrationStore'
import { GmailConfigComponent } from './GmailConfig'
import { SlackConfigComponent } from './SlackConfig'
import { CalendarConfigComponent } from './CalendarConfig'

export function IntegrationsView() {
  const integrations = useIntegrationStore((state) => state.integrations)

  const connectedCount = integrations.filter((int) => int.status === 'connected').length

  return (
    <div>
      <TopNav
        title="Integrations"
        subtitle={`${connectedCount} of ${integrations.length} integrations connected`}
      />

      <div className="p-6 max-w-4xl space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((int) => (
            <div
              key={int.id}
              className={`p-4 rounded-lg border ${
                int.status === 'connected'
                  ? 'border-success/20 bg-success/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="text-sm text-secondary">{int.name}</div>
              <div
                className={`text-lg font-semibold ${
                  int.status === 'connected' ? 'text-success' : 'text-secondary'
                }`}
              >
                {int.status === 'connected' ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="space-y-6">
          <GmailConfigComponent />
          <SlackConfigComponent />
          <CalendarConfigComponent />
        </div>
      </div>
    </div>
  )
}
