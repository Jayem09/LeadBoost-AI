const WEBHOOK_URL_KEY = 'n8n_webhook_url'
const WEBHOOK_LOG_KEY = 'n8n_webhook_log'
const WEBHOOK_EVENTS_KEY = 'n8n_webhook_events'
const MAX_LOG_ENTRIES = 20

export interface WebhookLog {
  event: string
  status: 'success' | 'failed'
  time: string
  timestamp: number
}

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

export function getWebhookLog(): WebhookLog[] {
  const raw = localStorage.getItem(WEBHOOK_LOG_KEY)
  return raw ? JSON.parse(raw) : []
}

function addLogEntry(entry: WebhookLog) {
  const log = getWebhookLog()
  log.unshift(entry)
  if (log.length > MAX_LOG_ENTRIES) log.length = MAX_LOG_ENTRIES
  localStorage.setItem(WEBHOOK_LOG_KEY, JSON.stringify(log))
}

export async function fireWebhook(event: string, payload: Record<string, any>): Promise<boolean> {
  const url = getWebhookUrl()
  if (!url) return false

  const enabledEvents = getWebhookEvents()
  if (!enabledEvents.includes(event)) return false

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() }),
    })

    addLogEntry({
      event,
      status: res.ok ? 'success' : 'failed',
      time: 'Just now',
      timestamp: Date.now(),
    })

    return res.ok
  } catch {
    addLogEntry({
      event,
      status: 'failed',
      time: 'Just now',
      timestamp: Date.now(),
    })
    return false
  }
}
