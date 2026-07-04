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

Import these JSON files into n8n via **Workflows > Import from File**.

| Template | File | What it does |
|----------|------|-------------|
| **Lead Notification** | `templates/lead-notification.json` | Emails you when a new lead is captured |
| **Follow-up Reminder** | `templates/follow-up-reminder.json` | Sends a follow-up email 3 days after lead creation |
| **Won Deal Celebration** | `templates/won-deal-celebration.json` | Notifies team when a lead is marked "won" |
| **Lost Lead Feedback** | `templates/lost-lead-feedback.json` | Sends a feedback survey when a lead is marked "lost" |

### Setup Steps

1. Open n8n at http://localhost:5678
2. Create an **SMTP credential** pointing to Mailpit (host: `mailpit`, port: `1025`, no auth)
3. Import a template: **Workflows > Import from File > select JSON**
4. In the **Send Email** node, select the SMTP credential you created
5. Update email addresses (`sendTo`) to your real addresses
6. Activate the workflow

### Quick Test

After importing a template and configuring the credential:

1. In the LeadBoost AI dashboard, go to **Automation**
2. Set webhook URL to `http://localhost:5678/webhook/lead-notification` (or the relevant path)
3. Enable the `lead.created` event
4. Click **Test Webhook**
5. Check Mailpit at http://localhost:8025 for the email

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
