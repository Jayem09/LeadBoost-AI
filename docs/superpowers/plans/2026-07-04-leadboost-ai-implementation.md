# LeadBoost AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Lead Management SaaS with dark/light mode, authentication, dashboard, leads table, pipeline kanban, analytics, and settings.

**Architecture:** React 19 + Vite SPA with feature-based structure. Zustand for state, Firebase for auth/database, shadcn/ui components, Tailwind CSS for styling with CSS variables for dark/light theming.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS, Zustand, Firebase Auth + Firestore, React Router v6, React Hook Form + Zod, Framer Motion, Recharts, Lucide React, shadcn/ui

---

## File Structure

```
src/
├── app/
│   ├── App.tsx                          # Root component with providers
│   ├── routes.tsx                       # Route definitions with lazy loading
│   └── providers.tsx                    # Theme + Auth providers
├── components/
│   ├── ui/                              # shadcn/ui primitives (button, card, badge, input, select, table, dialog, toast, dropdown-menu, avatar, skeleton)
│   ├── layout/
│   │   ├── Sidebar.tsx                  # Collapsible sidebar navigation
│   │   ├── TopNav.tsx                   # Top bar with search + user menu
│   │   └── AppShell.tsx                 # Layout wrapper (sidebar + main)
│   └── shared/
│       ├── StatCard.tsx                 # Metric display with trend
│       ├── StatusBadge.tsx              # Colored status dot + text
│       ├── LeadScoreBadge.tsx           # Hot/Warm/Cold badge
│       ├── SearchInput.tsx              # Debounced search
│       ├── EmptyState.tsx               # No data placeholder
│       └── LoadingSkeleton.tsx          # Skeleton loaders
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── firebase.ts
│   │   ├── store/
│   │   │   └── useAuthStore.ts
│   │   └── types/
│   │       └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardView.tsx
│   │   │   ├── LeadsOverviewChart.tsx
│   │   │   └── ActivityTimeline.tsx
│   │   └── hooks/
│   │       └── useDashboardStats.ts
│   ├── leads/
│   │   ├── components/
│   │   │   ├── LeadsView.tsx
│   │   │   ├── LeadsTable.tsx
│   │   │   ├── LeadForm.tsx
│   │   │   ├── LeadDetail.tsx
│   │   │   └── FilterBar.tsx
│   │   ├── hooks/
│   │   │   ├── useLeads.ts
│   │   │   └── useLeadFilters.ts
│   │   ├── services/
│   │   │   └── leadService.ts
│   │   ├── store/
│   │   │   └── useLeadStore.ts
│   │   └── types/
│   │       └── index.ts
│   ├── pipeline/
│   │   ├── components/
│   │   │   ├── PipelineView.tsx
│   │   │   ├── PipelineColumn.tsx
│   │   │   └── PipelineCard.tsx
│   │   ├── hooks/
│   │   │   └── usePipeline.ts
│   │   ├── services/
│   │   │   └── pipelineService.ts
│   │   └── store/
│   │       └── usePipelineStore.ts
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── AnalyticsView.tsx
│   │   │   ├── LeadsPerMonthChart.tsx
│   │   │   ├── LeadSourcesChart.tsx
│   │   │   ├── PipelineStatusChart.tsx
│   │   │   └── ScoreDistributionChart.tsx
│   │   └── hooks/
│   │       └── useAnalytics.ts
│   ├── automation/
│   │   ├── components/
│   │   │   ├── AutomationView.tsx
│   │   │   └── WebhookConfig.tsx
│   │   └── hooks/
│   │       └── useAutomation.ts
│   └── settings/
│       ├── components/
│       │   ├── SettingsView.tsx
│       │   ├── SettingsNav.tsx
│       │   ├── CompanySettings.tsx
│       │   ├── NotificationSettings.tsx
│       │   ├── LeadScoringSettings.tsx
│       │   └── TeamSettings.tsx
│       └── hooks/
│           └── useSettings.ts
├── hooks/
│   ├── useDebounce.ts
│   └── useTheme.ts
├── lib/
│   ├── firebase.ts
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
└── main.tsx
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`
- Create: `src/main.tsx`, `src/styles/globals.css`

- [ ] **Step 1: Initialize Vite project with React + TypeScript**

```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom zustand react-hook-form @hookform/resolvers zod framer-motion recharts lucide-react tailwindcss @tailwindcss/vite class-variance-authority clsx tailwind-merge
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D @types/node
```

- [ ] **Step 4: Configure Vite**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: Configure Tailwind with CSS variables for dark/light mode**

```css
/* src/styles/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-background: #FAFAFA;
  --color-card: #FFFFFF;
  --color-border: #E5E7EB;
  --color-primary: #111827;
  --color-secondary: #6B7280;
  --color-accent: #2563EB;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-muted: #52525B;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

.dark {
  --color-background: #09090B;
  --color-card: #18181B;
  --color-border: #27272A;
  --color-primary: #FAFAFA;
  --color-secondary: #A1A1AA;
  --color-accent: #2563EB;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-muted: #52525B;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background);
  color: var(--color-primary);
}
```

- [ ] **Step 6: Create entry point**

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 7: Create utility function**

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 8: Commit**

```bash
git init && git add . && git commit -m "chore: project setup with Vite, React 19, TypeScript, Tailwind"
```

---

## Task 2: Theme System (Dark/Light Mode)

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/app/providers.tsx`

- [ ] **Step 1: Create theme store**

```typescript
// src/hooks/useTheme.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'leadboost-theme' }
  )
)
```

- [ ] **Step 2: Create theme provider**

```typescript
// src/app/providers.tsx
import { useEffect, ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}
```

- [ ] **Step 3: Wire up in App.tsx**

```typescript
// src/app/App.tsx
import { ThemeProvider } from './providers'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-primary">
        {/* Routes will go here */}
      </div>
    </ThemeProvider>
  )
}

export default App
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTheme.ts src/app/providers.tsx src/app/App.tsx
git commit -m "feat: add dark/light theme system with persistence"
```

---

## Task 3: Shared Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/avatar.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/dropdown-menu.tsx`
- Create: `src/components/shared/StatCard.tsx`
- Create: `src/components/shared/StatusBadge.tsx`
- Create: `src/components/shared/LeadScoreBadge.tsx`
- Create: `src/components/shared/SearchInput.tsx`
- Create: `src/components/shared/EmptyState.tsx`
- Create: `src/components/shared/LoadingSkeleton.tsx`
- Create: `src/lib/constants.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create shared types**

```typescript
// src/types/index.ts
export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  budget: number
  industry: string
  serviceNeeded: string
  timeline: string
  status: LeadStatus
  tags: string[]
  notes: string
  leadScore: number
  source: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Activity {
  id: string
  type: 'created' | 'status_changed' | 'note_added' | 'email_sent' | 'meeting_scheduled'
  description: string
  leadId: string
  createdAt: Date
}
```

- [ ] **Step 2: Create constants**

```typescript
// src/lib/constants.ts
import { LeadStatus } from '@/types'

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  qualified: '#8B5CF6',
  contacted: '#F59E0B',
  meeting: '#6366F1',
  proposal: '#EC4899',
  won: '#22C55E',
  lost: '#EF4444',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  qualified: 'Qualified',
  contacted: 'Contacted',
  meeting: 'Meeting',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
}

export const PIPELINE_COLUMNS: LeadStatus[] = [
  'new', 'qualified', 'contacted', 'meeting', 'proposal', 'won', 'lost',
]

export const LEAD_SCORE_RANGES = [
  { label: 'Cold', min: 0, max: 19, color: '#71717A' },
  { label: 'Warm', min: 20, max: 34, color: '#F59E0B' },
  { label: 'Hot', min: 35, max: 100, color: '#EF4444' },
]
```

- [ ] **Step 3: Create Button component**

```typescript
// src/components/ui/button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent/90',
        secondary: 'border border-border bg-card text-primary hover:bg-card/80',
        ghost: 'text-secondary hover:bg-card hover:text-primary',
        danger: 'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

- [ ] **Step 4: Create Card component**

```typescript
// src/components/ui/card.tsx
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-border bg-card p-5',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-base font-medium text-primary', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'
```

- [ ] **Step 5: Create Input component**

```typescript
// src/components/ui/input.tsx
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
```

- [ ] **Step 6: Create Badge, Select, Avatar, Skeleton, Dialog, DropdownMenu components**

Create each following shadcn/ui patterns with the dark/light theme CSS variables. Each should use `cn()` for class merging and support the theme.

- [ ] **Step 7: Create StatCard**

```typescript
// src/components/shared/StatCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  trend?: { value: string; positive: boolean }
  icon?: LucideIcon
}

export function StatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">{title}</span>
          {Icon && <Icon className="h-4 w-4 text-secondary" />}
        </div>
        <div className="mt-2">
          <span className="text-2xl font-semibold text-primary">{value}</span>
        </div>
        {trend && (
          <div className="mt-1">
            <span
              className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-success' : 'text-warning'
              )}
            >
              {trend.positive ? '+' : ''}{trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 8: Create StatusBadge and LeadScoreBadge**

```typescript
// src/components/shared/StatusBadge.tsx
import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { LeadStatus } from '@/types'

interface StatusBadgeProps {
  status: LeadStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
      {STATUS_LABELS[status]}
    </Badge>
  )
}
```

```typescript
// src/components/shared/LeadScoreBadge.tsx
import { Badge } from '@/components/ui/badge'
import { LEAD_SCORE_RANGES } from '@/lib/constants'

interface LeadScoreBadgeProps {
  score: number
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  const range = LEAD_SCORE_RANGES.find(
    (r) => score >= r.min && score <= r.max
  ) || LEAD_SCORE_RANGES[0]

  return (
    <Badge
      variant="outline"
      style={{ borderColor: range.color, color: range.color }}
    >
      {range.label} ({score})
    </Badge>
  )
}
```

- [ ] **Step 9: Create SearchInput with debounce**

```typescript
// src/components/shared/SearchInput.tsx
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (value: string) => void
}

export function SearchInput({ placeholder = 'Search...', onSearch }: SearchInputProps) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
```

- [ ] **Step 10: Create useDebounce hook**

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

- [ ] **Step 11: Create EmptyState and LoadingSkeleton**

```typescript
// src/components/shared/EmptyState.tsx
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Icon className="h-12 w-12 text-secondary mb-4" />
      <h3 className="text-lg font-medium text-primary mb-1">{title}</h3>
      <p className="text-sm text-secondary">{description}</p>
    </div>
  )
}
```

- [ ] **Step 12: Commit**

```bash
git add src/components/ src/lib/constants.ts src/types/ src/hooks/useDebounce.ts
git commit -m "feat: add shared components, types, and constants"
```

---

## Task 4: Layout (Sidebar + TopNav + AppShell)

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/TopNav.tsx`
- Create: `src/components/layout/AppShell.tsx`

- [ ] **Step 1: Create Sidebar**

```typescript
// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BarChart3,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/automation', icon: Zap, label: 'Automation' },
]

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-[220px]'
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <span className="text-sm font-semibold text-primary">LeadBoost AI</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 text-secondary hover:text-primary"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-secondary hover:bg-card hover:text-primary',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 p-2 border-t border-border">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-secondary hover:bg-card hover:text-primary',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create TopNav**

```typescript
// src/components/layout/TopNav.tsx
import { Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TopNavProps {
  title: string
  subtitle?: string
}

export function TopNav({ title, subtitle }: TopNavProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div>
        <h1 className="text-lg font-semibold text-primary">{title}</h1>
        {subtitle && <p className="text-xs text-secondary">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create AppShell**

```typescript
// src/components/layout/AppShell.tsx
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add sidebar, top nav, and app shell layout"
```

---

## Task 5: Firebase Setup + Auth

**Files:**
- Create: `src/lib/firebase.ts`
- Create: `src/features/auth/services/firebase.ts`
- Create: `src/features/auth/store/useAuthStore.ts`
- Create: `src/features/auth/hooks/useAuth.ts`
- Create: `src/features/auth/types/index.ts`
- Create: `src/features/auth/components/LoginForm.tsx`
- Create: `src/features/auth/components/RegisterForm.tsx`
- Create: `src/features/auth/components/ForgotPasswordForm.tsx`

- [ ] **Step 1: Create Firebase config**

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

- [ ] **Step 2: Create auth service**

```typescript
// src/features/auth/services/firebase.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const googleProvider = new GoogleAuthProvider()

export const authService = {
  login: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),

  register: (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password),

  loginWithGoogle: () => signInWithPopup(auth, googleProvider),

  logout: () => signOut(auth),

  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),

  getCurrentUser: () => auth.currentUser,
}
```

- [ ] **Step 3: Create auth store**

```typescript
// src/features/auth/store/useAuthStore.ts
import { create } from 'zustand'
import { User } from 'firebase/auth'
import { authService } from '../services/firebase'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),

  login: async (email, password) => {
    try {
      set({ error: null })
      await authService.login(email, password)
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  register: async (email, password) => {
    try {
      set({ error: null })
      await authService.register(email, password)
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null })
      await authService.loginWithGoogle()
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  logout: async () => {
    await authService.logout()
    set({ user: null })
  },

  resetPassword: async (email) => {
    await authService.resetPassword(email)
  },

  clearError: () => set({ error: null }),
}))
```

- [ ] **Step 4: Create auth hook**

```typescript
// src/features/auth/hooks/useAuth.ts
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '../store/useAuthStore'

export function useAuth() {
  const { user, loading, setUser } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return unsubscribe
  }, [setUser])

  return { user, loading, isAuthenticated: !!user }
}
```

- [ ] **Step 5: Create LoginForm**

```typescript
// src/features/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const { login, loginWithGoogle, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch {
      // Error is handled by store
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-semibold text-primary mb-2">Welcome back</h2>
      <p className="text-sm text-secondary mb-6">Sign in to your account</p>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
          <button onClick={clearError} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm text-secondary mb-1.5 block">Email</label>
          <Input {...register('email')} placeholder="you@company.com" type="email" />
          {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm text-secondary mb-1.5 block">Password</label>
          <Input {...register('password')} placeholder="••••••••" type="password" />
          {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-secondary">
            <input type="checkbox" className="rounded border-border" />
            Remember me
          </label>
          <button type="button" className="text-accent hover:underline">
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-secondary">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={loginWithGoogle}>
          Continue with Google
        </Button>
        <Button variant="secondary">
          Continue with GitHub
        </Button>
      </div>

      <p className="text-center text-sm text-secondary mt-6">
        Don't have an account?{' '}
        <a href="/register" className="text-accent hover:underline">Start free trial</a>
      </p>
    </div>
  )
}
```

- [ ] **Step 6: Create RegisterForm and ForgotPasswordForm**

Follow same pattern as LoginForm with appropriate fields and validation.

- [ ] **Step 7: Commit**

```bash
git add src/lib/firebase.ts src/features/auth/
git commit -m "feat: add Firebase auth with login, register, and forgot password"
```

---

## Task 6: Dashboard Feature

**Files:**
- Create: `src/features/dashboard/components/DashboardView.tsx`
- Create: `src/features/dashboard/components/LeadsOverviewChart.tsx`
- Create: `src/features/dashboard/components/ActivityTimeline.tsx`
- Create: `src/features/dashboard/hooks/useDashboardStats.ts`

- [ ] **Step 1: Create DashboardView**

```typescript
// src/features/dashboard/components/DashboardView.tsx
import { TopNav } from '@/components/layout/TopNav'
import { StatCard } from '@/components/shared/StatCard'
import { LeadsOverviewChart } from './LeadsOverviewChart'
import { ActivityTimeline } from './ActivityTimeline'
import { Users, Flame, TrendingUp, DollarSign } from 'lucide-react'

export function DashboardView() {
  return (
    <div>
      <TopNav title="Dashboard" subtitle="Here's your overview" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value="1,284" trend={{ value: '12.5%', positive: true }} icon={Users} />
          <StatCard title="Hot Leads" value="48" trend={{ value: 'Needs attention', positive: false }} icon={Flame} />
          <StatCard title="Conversion Rate" value="24.8%" trend={{ value: '3.2%', positive: true }} icon={TrendingUp} />
          <StatCard title="Revenue" value="$84,250" trend={{ value: '18.7%', positive: true }} icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LeadsOverviewChart />
          </div>
          <div>
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create LeadsOverviewChart with Recharts**

```typescript
// src/features/dashboard/components/LeadsOverviewChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', leads: 45 },
  { month: 'Feb', leads: 72 },
  { month: 'Mar', leads: 58 },
  { month: 'Apr', leads: 95 },
  { month: 'May', leads: 68 },
  { month: 'Jun', leads: 88 },
]

export function LeadsOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: 8 }}
              labelStyle={{ color: '#FAFAFA' }}
            />
            <Bar dataKey="leads" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Create ActivityTimeline**

```typescript
// src/features/dashboard/components/ActivityTimeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const activities = [
  { color: '#22C55E', text: 'New lead: Acme Corp', time: '2h ago' },
  { color: '#2563EB', text: 'Deal won: TechStart', time: '4h ago' },
  { color: '#F59E0B', text: 'Meeting scheduled', time: '6h ago' },
  { color: '#8B5CF6', text: 'Lead qualified: NovaTech', time: '1d ago' },
  { color: '#EC4899', text: 'Proposal sent: BioGen', time: '2d ago' },
]

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="mt-1 h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: activity.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary">{activity.text}</p>
                <p className="text-xs text-secondary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/
git commit -m "feat: add dashboard with stat cards, chart, and activity timeline"
```

---

## Task 7: Leads Feature (Table + CRUD)

**Files:**
- Create: `src/features/leads/store/useLeadStore.ts`
- Create: `src/features/leads/services/leadService.ts`
- Create: `src/features/leads/hooks/useLeads.ts`
- Create: `src/features/leads/hooks/useLeadFilters.ts`
- Create: `src/features/leads/components/LeadsView.tsx`
- Create: `src/features/leads/components/LeadsTable.tsx`
- Create: `src/features/leads/components/LeadForm.tsx`
- Create: `src/features/leads/components/FilterBar.tsx`

- [ ] **Step 1: Create lead service (Firestore CRUD)**

```typescript
// src/features/leads/services/leadService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Lead, LeadStatus } from '@/types'

const COLLECTION = 'leads'

export const leadService = {
  subscribe: (userId: string, callback: (leads: Lead[]) => void) => {
    const q = query(
      collection(db, COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Lead[]
      callback(leads)
    })
  },

  create: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) =>
    addDoc(collection(db, COLLECTION), {
      ...lead,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }),

  update: (id: string, data: Partial<Lead>) =>
    updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: Timestamp.now(),
    }),

  delete: (id: string) => deleteDoc(doc(db, COLLECTION, id)),

  updateStatus: (id: string, status: LeadStatus) =>
    updateDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: Timestamp.now(),
    }),
}
```

- [ ] **Step 2: Create lead store**

```typescript
// src/features/leads/store/useLeadStore.ts
import { create } from 'zustand'
import { Lead, LeadStatus } from '@/types'
import { leadService } from '../services/leadService'

interface LeadStore {
  leads: Lead[]
  loading: boolean
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  updateStatus: (id: string, status: LeadStatus) => Promise<void>
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  loading: true,

  setLeads: (leads) => set({ leads, loading: false }),

  addLead: async (lead) => {
    await leadService.create(lead)
  },

  updateLead: async (id, data) => {
    await leadService.update(id, data)
  },

  deleteLead: async (id) => {
    await leadService.delete(id)
  },

  updateStatus: async (id, status) => {
    await leadService.updateStatus(id, status)
  },
}))
```

- [ ] **Step 3: Create LeadsTable**

```typescript
// src/features/leads/components/LeadsTable.tsx
import { Lead } from '@/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LeadsTableProps {
  leads: Lead[]
  onStatusChange: (id: string, status: Lead['status']) => void
}

export function LeadsTable({ leads, onStatusChange }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Name</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Company</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Email</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Budget</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Status</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Score</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-secondary">Created</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-secondary"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-border hover:bg-card/50 transition-colors"
            >
              <td className="py-3 px-4 text-sm font-medium text-primary">{lead.name}</td>
              <td className="py-3 px-4 text-sm text-secondary">{lead.company}</td>
              <td className="py-3 px-4 text-sm text-secondary">{lead.email}</td>
              <td className="py-3 px-4 text-sm text-primary">{formatCurrency(lead.budget)}</td>
              <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
              <td className="py-3 px-4"><LeadScoreBadge score={lead.leadScore} /></td>
              <td className="py-3 px-4 text-sm text-secondary">{formatDate(lead.createdAt)}</td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Create FilterBar and LeadsView**

- [ ] **Step 5: Add formatCurrency and formatDate to utils**

```typescript
// Add to src/lib/utils.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return date.toLocaleDateString()
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/leads/ src/lib/utils.ts
git commit -m "feat: add leads feature with table, CRUD, filtering, and search"
```

---

## Task 8: Pipeline Feature (Kanban)

**Files:**
- Create: `src/features/pipeline/store/usePipelineStore.ts`
- Create: `src/features/pipeline/services/pipelineService.ts`
- Create: `src/features/pipeline/components/PipelineView.tsx`
- Create: `src/features/pipeline/components/PipelineColumn.tsx`
- Create: `src/features/pipeline/components/PipelineCard.tsx`

- [ ] **Step 1: Create pipeline store (wraps lead store with kanban state)**

- [ ] **Step 2: Create PipelineView with 7 columns**

```typescript
// src/features/pipeline/components/PipelineView.tsx
import { TopNav } from '@/components/layout/TopNav'
import { PipelineColumn } from './PipelineColumn'
import { PIPELINE_COLUMNS } from '@/lib/constants'
import { useLeadStore } from '@/features/leads/store/useLeadStore'

export function PipelineView() {
  const { leads, updateStatus } = useLeadStore()

  return (
    <div>
      <TopNav title="Pipeline" subtitle="Drag and drop leads through your sales pipeline" />

      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              leads={leads.filter((l) => l.status === status)}
              onDrop={(leadId) => updateStatus(leadId, status)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create PipelineColumn and PipelineCard**

- [ ] **Step 4: Commit**

```bash
git add src/features/pipeline/
git commit -m "feat: add pipeline kanban board with drag-and-drop columns"
```

---

## Task 9: Analytics Feature

**Files:**
- Create: `src/features/analytics/components/AnalyticsView.tsx`
- Create: `src/features/analytics/components/LeadsPerMonthChart.tsx`
- Create: `src/features/analytics/components/LeadSourcesChart.tsx`
- Create: `src/features/analytics/components/PipelineStatusChart.tsx`
- Create: `src/features/analytics/components/ScoreDistributionChart.tsx`

- [ ] **Step 1: Create AnalyticsView with 4 stat cards + 4 charts**

- [ ] **Step 2: Create each chart component using Recharts**

LeadsPerMonthChart → AreaChart with filled blue
LeadSourcesChart → PieChart (donut)
PipelineStatusChart → horizontal BarChart
ScoreDistributionChart → vertical BarChart

- [ ] **Step 3: Commit**

```bash
git add src/features/analytics/
git commit -m "feat: add analytics dashboard with area, donut, and bar charts"
```

---

## Task 10: Settings Feature

**Files:**
- Create: `src/features/settings/components/SettingsView.tsx`
- Create: `src/features/settings/components/SettingsNav.tsx`
- Create: `src/features/settings/components/CompanySettings.tsx`
- Create: `src/features/settings/components/NotificationSettings.tsx`
- Create: `src/features/settings/components/LeadScoringSettings.tsx`

- [ ] **Step 1: Create SettingsView with two-column layout**

- [ ] **Step 2: Create SettingsNav with section links**

- [ ] **Step 3: Create CompanySettings form**

- [ ] **Step 4: Create NotificationSettings and LeadScoringSettings**

- [ ] **Step 5: Commit**

```bash
git add src/features/settings/
git commit -m "feat: add settings with company, notifications, and lead scoring"
```

---

## Task 11: Automation Feature

**Files:**
- Create: `src/features/automation/components/AutomationView.tsx`
- Create: `src/features/automation/components/WebhookConfig.tsx`
- Create: `src/features/automation/hooks/useAutomation.ts`

- [ ] **Step 1: Create AutomationView with webhook configuration**

- [ ] **Step 2: Create WebhookConfig component**

- [ ] **Step 3: Commit**

```bash
git add src/features/automation/
git commit -m "feat: add automation view with n8n webhook configuration"
```

---

## Task 12: Routing + App Assembly

**Files:**
- Modify: `src/app/App.tsx`
- Create: `src/app/routes.tsx`

- [ ] **Step 1: Create routes with lazy loading**

```typescript
// src/app/routes.tsx
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const LoginPage = lazy(() => import('@/features/auth/components/LoginForm'))
const RegisterPage = lazy(() => import('@/features/auth/components/RegisterForm'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/components/ForgotPasswordForm'))
const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardView'))
const LeadsPage = lazy(() => import('@/features/leads/components/LeadsView'))
const PipelinePage = lazy(() => import('@/features/pipeline/components/PipelineView'))
const AnalyticsPage = lazy(() => import('@/features/analytics/components/AnalyticsView'))
const AutomationPage = lazy(() => import('@/features/automation/components/AutomationView'))
const SettingsPage = lazy(() => import('@/features/settings/components/SettingsView'))

export const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
]

export const protectedRoutes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/leads', element: <LeadsPage /> },
  { path: '/pipeline', element: <PipelinePage /> },
  { path: '/analytics', element: <AnalyticsPage /> },
  { path: '/automation', element: <AutomationPage /> },
  { path: '/settings', element: <SettingsPage /> },
]
```

- [ ] **Step 2: Wire up App.tsx with auth guard**

- [ ] **Step 3: Commit**

```bash
git add src/app/
git commit -m "feat: add routing with lazy loading and auth guard"
```

---

## Task 13: Final Polish

- [ ] **Step 1: Verify dark mode works across all components**

- [ ] **Step 2: Verify light mode works across all components**

- [ ] **Step 3: Add skeleton loaders for async content**

- [ ] **Step 4: Test all routes and navigation**

- [ ] **Step 5: Run type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Final commit**

```bash
git add . && git commit -m "chore: final polish and verification"
```

---

*Plan complete. 13 tasks, each producing working, testable software.*
