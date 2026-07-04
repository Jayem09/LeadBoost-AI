# LeadBoost AI

B2B SaaS lead management platform with automated workflows.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  React App   │────▶│  Supabase    │────▶│  PostgreSQL  │
│  (Vite Dev)  │     │  (Cloud)     │     │  (Cloud)     │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       │ webhook
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  n8n         │────▶│  Mailpit     │     │  Redis       │
│  :5678       │     │  :8025       │     │  :6379       │
└──────────────┘     └──────────────┘     └──────────────┘
```

- **React App** — Frontend SPA, runs via `npm run dev` (not containerized)
- **Supabase Cloud** — Auth, database, real-time subscriptions
- **n8n** — Workflow automation engine (Docker)
- **Mailpit** — Local email testing (Docker)
- **Redis** — Future queue/cache support (Docker)

## Tech Stack

- React 19, Vite, TypeScript
- Tailwind CSS, shadcn/ui
- Zustand (state management)
- Supabase (auth + database)
- n8n (workflow automation)
- Docker Compose (infrastructure)

## Docker Setup

Infrastructure services run in Docker. The React app runs locally for fast HMR.

### Start Docker

```bash
docker compose up -d
```

### Stop Docker

```bash
docker compose down
```

### Services

| Service | Port | Purpose |
|---------|------|---------|
| n8n | 5678 | Workflow automation engine |
| Mailpit (SMTP) | 1025 | Local SMTP server |
| Mailpit (Dashboard) | 8025 | Email UI viewer |
| Redis | 6379 | Cache/queue (future) |

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_N8N_WEBHOOK_URL` | No | n8n webhook URL for lead events |
| `VITE_N8N_API_URL` | No | n8n REST API base URL |
| `VITE_N8N_API_KEY` | No | n8n API key for workflow triggers |
| `MAIL_FROM` | No | Sender email address |
| `APP_URL` | No | Frontend URL (default: http://localhost:5173) |

## Running the Project

### 1. Start Docker infrastructure

```bash
docker compose up -d
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

### 4. Open

- Frontend: http://localhost:5173
- n8n: http://localhost:5678
- Mailpit: http://localhost:8025

## Folder Structure

```
project/
├── docker-compose.yml        # Docker services (n8n, Mailpit, Redis)
├── .dockerignore
├── .env.example
├── README.md
├── frontend/                 # React app (root of repo)
│   ├── src/
│   │   ├── app/              # Routes, providers, App shell
│   │   ├── components/       # Shared UI components
│   │   ├── features/         # Feature modules (leads, auth, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities, Supabase client, webhook helpers
│   │   ├── services/         # Automation service (n8n integration)
│   │   ├── styles/           # Global styles
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── docs/                     # Documentation
└── n8n/                      # n8n workflow configs
    ├── workflows/            # Exported workflow JSON files
    ├── credentials/          # Exported credential configs
    ├── templates/            # Reusable workflow templates
    └── README.md
```

## n8n Integration

The frontend communicates with n8n through the `AutomationService` (`src/services/automation.service.ts`).

### Webhook Events

| Event | Trigger |
|-------|---------|
| `lead.created` | New lead submitted |
| `lead.updated` | Lead data edited |
| `lead.deleted` | Lead removed |
| `lead.status_changed` | Lead status updated |

### Setup

1. Open n8n at http://localhost:5678
2. Create a webhook workflow
3. Copy the webhook URL
4. Paste it into the Automation page in the dashboard (or set `VITE_N8N_WEBHOOK_URL` in `.env`)

### Recommended Workflows

- **Lead Notification** — Slack/email on new lead
- **Follow-up Reminder** — Scheduled follow-up task
- **Won Deal** — Team notification
- **Lost Lead** — Feedback survey

## Future Roadmap

- [ ] n8n workflow template imports
- [ ] Redis-backed job queue for async tasks
- [ ] Mailpit integration for transactional emails
- [ ] Webhook retry queue with Redis
- [ ] n8n API integration for dynamic workflow triggering
