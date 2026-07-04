const DEFAULT_TIMEOUT_MS = 10_000
const MAX_RETRIES = 3
const BASE_DELAY_MS = 500

export interface WebhookResult {
  success: boolean
  status?: number
  error?: string
}

export interface WebhookLog {
  event: string
  status: 'success' | 'failed'
  time: string
  timestamp: number
}

export type LeadEvent =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.deleted'
  | 'lead.status_changed'
  | 'lead.won'
  | 'lead.lost'
  | 'lead.followup_reminder'

const WEBHOOK_LOG_KEY = 'n8n_webhook_log'
const MAX_LOG_ENTRIES = 20

function getConfig() {
  return {
    webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
    apiUrl: import.meta.env.VITE_N8N_API_URL || '',
    apiKey: import.meta.env.VITE_N8N_API_KEY || '',
  }
}

function addLogEntry(entry: WebhookLog) {
  const raw = localStorage.getItem(WEBHOOK_LOG_KEY)
  const log: WebhookLog[] = raw ? JSON.parse(raw) : []
  log.unshift(entry)
  if (log.length > MAX_LOG_ENTRIES) log.length = MAX_LOG_ENTRIES
  localStorage.setItem(WEBHOOK_LOG_KEY, JSON.stringify(log))
}

export function getWebhookLog(): WebhookLog[] {
  const raw = localStorage.getItem(WEBHOOK_LOG_KEY)
  return raw ? JSON.parse(raw) : []
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs)
    } catch (err) {
      lastError = err as Error
      if (attempt < retries - 1) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt)
        console.warn(`[automation] Retry ${attempt + 1}/${retries} after ${delayMs}ms`)
        await delay(delayMs)
      }
    }
  }
  throw lastError
}

async function post(
  url: string,
  body: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<WebhookResult> {
  try {
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
    return { success: res.ok, status: res.status }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[automation] Request failed: ${msg}`)
    return { success: false, error: msg }
  }
}

async function get(url: string, headers?: Record<string, string>): Promise<WebhookResult> {
  try {
    const res = await fetchWithTimeout(url, {
      method: 'GET',
      headers,
    })
    return { success: res.ok, status: res.status }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[automation] Health check failed: ${msg}`)
    return { success: false, error: msg }
  }
}

export const automationService = {
  async sendLeadWebhook(event: LeadEvent, payload: Record<string, unknown>): Promise<boolean> {
    const { webhookUrl } = getConfig()
    if (!webhookUrl) return false

    const result = await post(webhookUrl, {
      event,
      payload,
      timestamp: new Date().toISOString(),
    })

    addLogEntry({
      event,
      status: result.success ? 'success' : 'failed',
      time: 'Just now',
      timestamp: Date.now(),
    })

    return result.success
  },

  async triggerWorkflow(workflowId: string, data: Record<string, unknown>): Promise<boolean> {
    const { apiUrl, apiKey } = getConfig()
    if (!apiUrl || !apiKey) {
      console.warn('[automation] N8N_API_URL or N8N_API_KEY not configured')
      return false
    }

    const url = `${apiUrl}/workflows/${workflowId}/run`
    const result = await post(url, { data }, { 'X-N8N-API-KEY': apiKey })
    return result.success
  },

  async healthCheck(): Promise<boolean> {
    const { apiUrl, apiKey } = getConfig()
    if (!apiUrl) return false

    const result = await get(apiUrl, apiKey ? { 'X-N8N-API-KEY': apiKey } : undefined)
    return result.success
  },
}
