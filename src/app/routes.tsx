import { lazy } from 'react'

const DashboardView = lazy(() => import('@/features/dashboard/components/DashboardView').then(m => ({ default: m.DashboardView })))
const LeadsView = lazy(() => import('@/features/leads/components/LeadsView').then(m => ({ default: m.LeadsView })))
const PipelineView = lazy(() => import('@/features/pipeline/components/PipelineView').then(m => ({ default: m.PipelineView })))
const AnalyticsView = lazy(() => import('@/features/analytics/components/AnalyticsView').then(m => ({ default: m.AnalyticsView })))
const AutomationView = lazy(() => import('@/features/automation/components/AutomationView').then(m => ({ default: m.AutomationView })))
const SettingsView = lazy(() => import('@/features/settings/components/SettingsView').then(m => ({ default: m.SettingsView })))

export const routes = [
  { path: '/', element: <DashboardView /> },
  { path: '/leads', element: <LeadsView /> },
  { path: '/pipeline', element: <PipelineView /> },
  { path: '/analytics', element: <AnalyticsView /> },
  { path: '/automation', element: <AutomationView /> },
  { path: '/settings', element: <SettingsView /> },
]
