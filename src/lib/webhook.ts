import { automationService, getWebhookLog } from '@/services/automation.service'

export type { WebhookLog } from '@/services/automation.service'

const WEBHOOK_URL_KEY = 'n8n_webhook_url'
const WEBHOOK_EVENTS_KEY = 'n8n_webhook_events'

export function getWebhookUrl(): string {
  return localStorage.getItem(WEBHOOK_URL_KEY) || ''
}

export function setWebhookUrl(url: string) {
  localStorage.setItem(WEBHOOK_URL_KEY, url)
}

export function getWebhookEvents(): string[] {
  const raw = localStorage.getItem(WEBHOOK_EVENTS_KEY)
  return raw ? JSON.parse(raw) : ['lead.created', 'lead.status_changed', 'lead.updated', 'lead.deleted']
}

export function setWebhookEvents(events: string[]) {
  localStorage.setItem(WEBHOOK_EVENTS_KEY, JSON.stringify(events))
}

export { getWebhookLog }

export async function fireWebhook(event: string, payload: Record<string, any>): Promise<boolean> {
  const enabledEvents = getWebhookEvents()
  if (!enabledEvents.includes(event)) return false
  return automationService.sendLeadWebhook(event as any, payload)
}
