import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type IntegrationType = 'gmail' | 'slack' | 'calendar'

export type IntegrationStatus = 'connected' | 'disconnected' | 'testing'

export interface GmailConfig {
  senderEmail: string
  appPassword: string
}

export interface SlackConfig {
  webhookUrl: string
  channelName: string
}

export interface CalendarConfig {
  googleCalendarLink: string
  outlookCalendarLink: string
}

export type IntegrationConfig = GmailConfig | SlackConfig | CalendarConfig

export interface Integration {
  id: IntegrationType
  name: string
  description: string
  icon: string
  status: IntegrationStatus
  config: IntegrationConfig
  testResult?: 'success' | 'failed' | null
}

interface IntegrationStore {
  integrations: Integration[]
  updateConfig: (id: IntegrationType, config: Partial<IntegrationConfig>) => void
  setStatus: (id: IntegrationType, status: IntegrationStatus) => void
  setTestResult: (id: IntegrationType, result: 'success' | 'failed' | null) => void
  getIntegration: (id: IntegrationType) => Integration | undefined
}

const defaultIntegrations: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send emails to leads directly from LeadBoost AI',
    icon: 'mail',
    status: 'disconnected',
    config: {
      senderEmail: '',
      appPassword: '',
    } as GmailConfig,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified about lead updates in your Slack channel',
    icon: 'message-square',
    status: 'disconnected',
    config: {
      webhookUrl: '',
      channelName: '',
    } as SlackConfig,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Generate scheduling links for lead meetings',
    icon: 'calendar',
    status: 'disconnected',
    config: {
      googleCalendarLink: '',
      outlookCalendarLink: '',
    } as CalendarConfig,
  },
]

export const useIntegrationStore = create<IntegrationStore>()(
  persist(
    (set, get) => ({
      integrations: defaultIntegrations,

      updateConfig: (id, config) =>
        set((state) => ({
          integrations: state.integrations.map((int) =>
            int.id === id ? { ...int, config: { ...int.config, ...config } } : int
          ),
        })),

      setStatus: (id, status) =>
        set((state) => ({
          integrations: state.integrations.map((int) =>
            int.id === id ? { ...int, status } : int
          ),
        })),

      setTestResult: (id, result) =>
        set((state) => ({
          integrations: state.integrations.map((int) =>
            int.id === id ? { ...int, testResult: result } : int
          ),
        })),

      getIntegration: (id) => get().integrations.find((int) => int.id === id),
    }),
    {
      name: 'leadboost-integrations',
    }
  )
)
