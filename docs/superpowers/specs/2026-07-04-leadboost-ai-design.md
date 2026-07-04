# LeadBoost AI — Design Specification

**Date:** 2026-07-04
**Version:** 1.0
**Status:** Approved for Implementation

---

## 1. Product Overview

LeadBoost AI is a modern Lead Management and Marketing Automation SaaS platform. It helps businesses capture, organize, qualify, and manage incoming leads — replacing spreadsheets and manual follow-ups with an intelligent CRM dashboard and automation workflows.

### Target Users
- Marketing Agencies
- Web Development Agencies
- Freelancers & Consultants
- Small Businesses & Contractors
- Dental Clinics
- Real Estate Agents
- Service Businesses

### Core Value Proposition
Businesses receive leads through forms, social media, or referrals but often forget to reply, lose customer information, have no follow-up process, and cannot prioritize important customers. LeadBoost AI solves this.

---

## 2. Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Components | shadcn/ui |
| State | Zustand |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| Automation | n8n Webhooks |
| Deployment | Vercel |

### State Management

**Zustand** — feature-based stores with no boilerplate:
- `useAuthStore` — user session, authentication state, profile
- `useLeadStore` — lead CRUD, filtering, sorting, search
- `usePipelineStore` — kanban board state, drag-drop
- `useUIStore` — sidebar collapse, theme, modals, toasts

### Data Flow

```
Firestore (real-time listeners) → Zustand Store → React Components
    ↑                                                    |
    └──────────── User Actions (CRUD) ──────────────────┘
```

### Project Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── layout/                # Sidebar, TopNav, AppShell
│   └── shared/                # Reusable components (StatCard, Badge, etc.)
├── features/
│   ├── auth/
│   │   ├── components/        # LoginForm, RegisterForm
│   │   ├── hooks/             # useAuth
│   │   ├── services/          # firebase auth operations
│   │   ├── store/             # useAuthStore
│   │   └── types/
│   ├── dashboard/
│   │   ├── components/        # DashboardView, StatCards, ActivityFeed
│   │   └── hooks/             # useDashboardStats
│   ├── leads/
│   │   ├── components/        # LeadsTable, LeadForm, LeadDetail
│   │   ├── hooks/             # useLeads, useLeadFilters
│   │   ├── services/          # leadService (Firestore CRUD)
│   │   ├── store/             # useLeadStore
│   │   └── types/
│   ├── pipeline/
│   │   ├── components/        # PipelineBoard, PipelineColumn, LeadCard
│   │   ├── hooks/             # usePipeline, useDragDrop
│   │   ├── services/          # pipelineService
│   │   └── store/             # usePipelineStore
│   ├── analytics/
│   │   ├── components/        # AnalyticsView, Charts
│   │   └── hooks/             # useAnalytics
│   ├── automation/
│   │   ├── components/        # AutomationView, WebhookConfig
│   │   └── hooks/
│   └── settings/
│       ├── components/        # SettingsView, CompanySettings, ProfileSettings
│       └── hooks/
├── hooks/
│   └── useDebounce.ts
├── services/
│   └── firebase.ts            # Firebase config & initialization
├── lib/
│   └── utils.ts               # cn(), formatDate, formatCurrency
├── types/
│   └── index.ts               # Shared types
├── styles/
│   └── globals.css            # Tailwind imports, CSS variables
└── app/
    └── layout.tsx
```

---

## 3. Design System

### Color Palette

**Dark Mode (Primary)**

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#09090B` | Page background |
| Card | `#18181B` | Card surfaces |
| Border | `#27272A` | All borders |
| Primary Text | `#FAFAFA` | Headings, numbers |
| Secondary Text | `#A1A1AA` | Labels, descriptions |
| Accent | `#2563EB` | CTAs, links, active states |
| Success | `#22C55E` | Positive trends, Won status |
| Warning | `#F59E0B` | Hot leads, attention |
| Danger | `#EF4444` | Errors, Lost status |

**Light Mode (Secondary)**

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#FAFAFA` | Page background |
| Card | `#FFFFFF` | Card surfaces |
| Border | `#E5E7EB` | All borders |
| Primary Text | `#111827` | Headings, numbers |
| Secondary Text | `#6B7280` | Labels, descriptions |
| Accent | `#2563EB` | Same as dark |
| Success | `#22C55E` | Same as dark |
| Warning | `#F59E0B` | Same as dark |
| Danger | `#EF4444` | Same as dark |

### Typography

**Font Family:** Inter

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| h1 | 24px | 600 | 1.33 | Page titles |
| h2 | 20px | 600 | 1.4 | Section headers |
| h3 | 16px | 500 | 1.5 | Card headers |
| body | 14px | 400 | 1.5 | Default text |
| small | 12px | 400 | 1.5 | Labels, timestamps |
| metric | 24-30px | 600 | 1.2 | Dashboard numbers |

### Spacing (8px Grid)

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 40px |
| 3xl | 48px |
| 4xl | 64px |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 12px |
| Input fields | 8px |
| Badges | 6px |
| Modals | 12px |
| Avatars | 9999px (circle) |

---

## 4. Screens & Components

### 4.1 Authentication

**Login Screen**
- Split layout: Left = branding (dark, centered text), Right = form card
- Fields: Email, Password (with eye toggle)
- Features: Remember me, Forgot password, Social auth (Google, GitHub)
- CTA: "Sign in" primary button
- Footer: "Don't have an account? Start free trial"

**Register Screen**
- Same split layout as login
- Fields: Full Name, Email, Password
- Features: Social auth (Google, GitHub)
- CTA: "Create account" primary button
- Footer: "Already have an account? Sign in"

**Forgot Password**
- Centered card layout
- Field: Email
- CTA: "Send reset link" button
- Back to login link

### 4.2 Dashboard

**Layout:** Sidebar (220px) + Main content area

**Components:**
- `StatCard` — Metric display with value, label, trend indicator (green up / amber warning)
- `BarChart` — Leads per month (6 bars, primary blue)
- `ActivityTimeline` — Color-coded dots (green=new lead, blue=deal won, amber=meeting)

**Data Displayed:**
- Total Leads: 1,284 (+12.5%)
- Hot Leads: 48 (warning)
- Conversion Rate: 24.8% (+3.2%)
- Revenue: $84,250 (+18.7%)
- Leads Overview bar chart
- Recent Activity feed

### 4.3 Leads Management

**Layout:** Full-width table with top bar

**Components:**
- `LeadsTable` — Data table with sticky header, sortable columns, row hover
- `LeadScoreBadge` — Hot (red/orange, 35+), Warm (amber, 20-34), Cold (gray, <20)
- `StatusBadge` — Colored dot + text for each status
- `FilterBar` — Status, Industry, Sort dropdowns + Clear filters
- `SearchInput` — Global lead search
- `BulkActions` — Checkbox selection with bulk operations

**Table Columns:** Checkbox, Name, Company, Email, Budget, Status, Lead Score, Tags, Created, Actions

**Status Colors:**
- New: Blue (#3B82F6)
- Qualified: Purple (#8B5CF6)
- Contacted: Amber (#F59E0B)
- Meeting: Indigo (#6366F1)
- Proposal: Pink (#EC4899)
- Won: Green (#22C55E)
- Lost: Red (#EF4444)

**Lead Data Model:**
```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: number;
  industry: string;
  serviceNeeded: string;
  timeline: string;
  status: LeadStatus;
  tags: string[];
  notes: string;
  leadScore: number;
  source: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}
```

### 4.4 Pipeline (Kanban)

**Layout:** Horizontal scroll of 7 columns

**Columns:**
1. New (Blue) — 3 cards
2. Qualified (Purple) — 2 cards
3. Contacted (Amber) — 2 cards
4. Meeting (Indigo) — 1 card
5. Proposal (Pink) — 1 card
6. Won (Green) — 1 card
7. Lost (Red) — 1 card

**Card Components:**
- Lead name (white, 14px, 500)
- Company name (gray, 12px)
- Budget (white, 14px)
- Lead Score badge (Hot/Warm/Cold)
- Time ago (gray, 12px)
- Avatar circle with initials

**Interaction:**
- Drag and drop between columns
- Subtle hover effect on cards
- Column header shows count badge

### 4.5 Analytics

**Layout:** 3-row grid

**Row 1:** 4 Stat Cards (same as dashboard)

**Row 2 (2:1 split):**
- Leads Per Month — Area chart (filled #2563EB with opacity)
- Lead Sources — Donut chart (Website 40%, Referral 25%, Social 20%, Direct 15%)

**Row 3 (1:1 split):**
- Pipeline Status — Horizontal bar chart (7 status bars)
- Lead Score Distribution — Vertical bar chart (5 buckets: Cold/Warm/Hot/Super Hot/Elite)

### 4.6 Settings

**Layout:** Two-column (240px nav + content)

**Navigation Sections:**
- Account
- Company
- Notifications
- Lead Scoring
- Team Members
- Integrations

**Company Settings:**
- Company Name, Website, Industry, Size, Timezone
- Branding: Primary Color, Logo Upload, Tagline

**Form Inputs:**
- Dark background (#09090B), border #27272A, rounded 8px, height 40px
- Labels above inputs
- Focus state: blue border

### 4.7 Automation

**Layout:** Webhook configuration for n8n integration

**Components:**
- Webhook URL display
- Event type selector
- Activity log table
- Test webhook button

---

## 5. Lead Scoring Rules

| Rule | Points |
|------|--------|
| Budget > $5,000 | +40 |
| Timeline = This Week | +30 |
| Business Owner | +20 |
| Company Size > 10 | +10 |

**Score Ranges:**
- Cold: 0-19
- Warm: 20-34
- Hot: 35+

---

## 6. Database Schema

### Collections

**users**
```
{
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Timestamp
}
```

**companies**
```
{
  id: string
  userId: string
  name: string
  website?: string
  industry?: string
  size?: string
  timezone?: string
  branding: {
    primaryColor: string
    logo?: string
    tagline?: string
  }
  createdAt: Timestamp
}
```

**leads**
```
{
  id: string
  userId: string
  companyId?: string
  name: string
  email: string
  phone: string
  company: string
  budget: number
  industry: string
  serviceNeeded: string
  timeline: string
  status: 'new' | 'qualified' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost'
  tags: string[]
  notes: string
  leadScore: number
  source: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**notes**
```
{
  id: string
  leadId: string
  userId: string
  content: string
  createdAt: Timestamp
}
```

**activities**
```
{
  id: string
  userId: string
  leadId: string
  type: 'created' | 'status_changed' | 'note_added' | 'email_sent' | 'meeting_scheduled'
  description: string
  metadata?: Record<string, any>
  createdAt: Timestamp
}
```

**tasks**
```
{
  id: string
  userId: string
  leadId: string
  title: string
  dueDate: Timestamp
  completed: boolean
  createdAt: Timestamp
}
```

**settings**
```
{
  id: string
  userId: string
  notifications: {
    email: boolean
    browser: boolean
    newLeadAlert: boolean
  }
  leadScoring: {
    rules: Array<{
      condition: string
      points: number
      enabled: boolean
    }>
  }
  createdAt: Timestamp
}
```

**automation_logs**
```
{
  id: string
  userId: string
  webhookUrl: string
  event: string
  payload: Record<string, any>
  status: 'success' | 'failed'
  response?: string
  createdAt: Timestamp
}
```

---

## 7. Routing

| Path | Component | Auth Required |
|------|-----------|---------------|
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/forgot-password` | ForgotPasswordPage | No |
| `/verify-email` | VerifyEmailPage | Yes |
| `/` | DashboardPage | Yes |
| `/leads` | LeadsPage | Yes |
| `/leads/:id` | LeadDetailPage | Yes |
| `/pipeline` | PipelinePage | Yes |
| `/analytics` | AnalyticsPage | Yes |
| `/automation` | AutomationPage | Yes |
| `/settings` | SettingsPage | Yes |

All routes except auth pages are lazy-loaded with React.lazy + Suspense.

---

## 8. Component Library

### Buttons
- **Primary:** Solid accent (#2563EB), white text, 44px height, rounded 8px
- **Secondary:** Border (#27272A), gray text, same dimensions
- **Ghost:** Transparent, gray text
- **Danger:** Red (#EF4444), white text
- **Size:** Compact (36px height for inline), Default (44px)

### Cards
- Rounded 12px, thin border, background #18181B
- Padding: 20-24px
- No shadow (dark mode), subtle shadow (light mode)

### Badges
- Rounded 6px
- Status dots: 6px circles with status colors
- Lead Score: Hot (red/orange bg), Warm (amber bg), Cold (gray bg)

### Tables
- Sticky header with #09090B background
- Row height: ~48px
- Hover state: slightly lighter background
- Sortable column headers with arrow indicators

### Forms
- Labels: 14px, #A1A1AA, 6px below input
- Inputs: #09090B bg, #27272A border, 40px height, 8px radius
- Focus: #2563EB border
- Error: #EF4444 border + message
- Placeholder: #52525B

### Modals/Dialogs
- Backdrop: rgba(0,0,0,0.6)
- Card: #18181B, rounded 12px, max-width 480px
- Header, body, footer with clear separation

### Toasts
- Fixed bottom-right position
- Success (green), Error (red), Warning (amber), Info (blue)
- Auto-dismiss after 5 seconds

---

## 9. Performance

- Lazy load all route components
- Code split at feature level
- Memoize expensive computations (lead scores, analytics aggregations)
- Firestore query optimization with proper indexes
- Skeleton loaders for all async content
- Debounced search inputs (300ms)

---

## 10. Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels on icons and buttons
- Color contrast ratio >= 4.5:1 (WCAG AA)
- Focus visible states (blue outline)
- Screen reader support for dynamic content
- Semantic HTML (nav, main, header, section)

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Stack layout, hamburger menu |
| Tablet | 768-1024px | Collapsed sidebar, 2-col grids |
| Desktop | > 1024px | Full sidebar, 4-col grids |

---

## 12. Design Screens Reference

All screens generated via Stitch AI and available at:
- Project: `projects/6810203756127988452`
- Design System: `assets/12227796834332095782`
- Local screenshots: `.superpowers/brainstorm/*/content/screens/`

---

## 13. What to Avoid

- Giant gradients
- Neon colors
- Glassmorphism
- Floating random cards
- Massive shadows
- Rounded-3xl everywhere
- Huge hero sections
- Emoji-heavy interfaces
- Dashboard clutter
- Template-looking SaaS
- AI-generated appearance

---

*Design spec complete. Ready for implementation planning.*
