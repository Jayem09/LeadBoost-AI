# n8n Automation

Workflow automation engine for LeadBoost AI.

## Setup

1. Start n8n via Docker Compose: `docker compose up -d n8n`
2. Open n8n at http://localhost:5678
3. Create your first workflow

## Folder Structure

```
n8n/
├── workflows/      # Exported workflow JSON files
├── credentials/    # Exported credential configs
├── templates/      # Reusable workflow templates
└── README.md
```

## Webhook Events

The frontend fires these events to n8n:

| Event | Trigger |
|-------|---------|
| `lead.created` | New lead submitted |
| `lead.updated` | Lead data edited |
| `lead.deleted` | Lead removed |
| `lead.status_changed` | Lead status updated (e.g., won, lost) |

## Workflow Templates

Place exported workflow JSON files in `templates/`. Import them into n8n via the UI.

### Recommended Workflows

- **Lead Notification** — Send Slack/email when a new lead arrives
- **Follow-up Reminder** — Schedule a follow-up task 3 days after lead creation
- **Won Deal Celebration** — Notify team when a lead is marked "won"
- **Lost Lead Feedback** — Send a survey when a lead is marked "lost"

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_N8N_WEBHOOK_URL` | Default webhook URL | `http://localhost:5678/webhook/leadboost` |
| `VITE_N8N_API_URL` | n8n REST API base URL | `http://localhost:5678/api/v1` |
| `VITE_N8N_API_KEY` | n8n API key for workflow triggers | — |

## Creating a Webhook in n8n

1. Create a new workflow
2. Add a **Webhook** node
3. Set the HTTP Method to **POST**
4. Copy the webhook URL
5. Paste it into the Automation page in the LeadBoost AI dashboard
