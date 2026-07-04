import { lazy } from 'react'

const LandingPage = lazy(() => import('@/features/landing/components/LandingPage').then(m => ({ default: m.LandingPage })))
const PricingPage = lazy(() => import('@/features/landing/components/PricingPage').then(m => ({ default: m.PricingPage })))
const AboutPage = lazy(() => import('@/features/landing/components/AboutPage').then(m => ({ default: m.AboutPage })))
const DashboardView = lazy(() => import('@/features/dashboard/components/DashboardView').then(m => ({ default: m.DashboardView })))
const LeadsView = lazy(() => import('@/features/leads/components/LeadsView').then(m => ({ default: m.LeadsView })))
const LeadDetail = lazy(() => import('@/features/leads/components/LeadDetail').then(m => ({ default: m.LeadDetail })))
const PipelineView = lazy(() => import('@/features/pipeline/components/PipelineView').then(m => ({ default: m.PipelineView })))
const AnalyticsView = lazy(() => import('@/features/analytics/components/AnalyticsView').then(m => ({ default: m.AnalyticsView })))
const AutomationView = lazy(() => import('@/features/automation/components/AutomationView').then(m => ({ default: m.AutomationView })))
const EmailSequencesView = lazy(() => import('@/features/email-sequences/components/EmailSequencesView').then(m => ({ default: m.EmailSequencesView })))
const EmailTemplatesView = lazy(() => import('@/features/email-templates/components/EmailTemplatesView').then(m => ({ default: m.EmailTemplatesView })))
const SettingsView = lazy(() => import('@/features/settings/components/SettingsView').then(m => ({ default: m.SettingsView })))
const TasksView = lazy(() => import('@/features/tasks/components/TasksView').then(m => ({ default: m.TasksView })))
const IntegrationsView = lazy(() => import('@/features/integrations/components/IntegrationsView').then(m => ({ default: m.IntegrationsView })))
const LoginForm = lazy(() => import('@/features/auth/components/LoginForm').then(m => ({ default: m.LoginForm })))
const RegisterForm = lazy(() => import('@/features/auth/components/RegisterForm').then(m => ({ default: m.RegisterForm })))
const ForgotPasswordForm = lazy(() => import('@/features/auth/components/ForgotPasswordForm').then(m => ({ default: m.ForgotPasswordForm })))

export const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/login', element: <LoginForm /> },
  { path: '/register', element: <RegisterForm /> },
  { path: '/forgot-password', element: <ForgotPasswordForm /> },
]

export const protectedRoutes = [
  { path: '/dashboard', element: <DashboardView /> },
  { path: '/leads', element: <LeadsView /> },
  { path: '/leads/:id', element: <LeadDetail /> },
  { path: '/pipeline', element: <PipelineView /> },
  { path: '/analytics', element: <AnalyticsView /> },
  { path: '/tasks', element: <TasksView /> },
  { path: '/automation', element: <AutomationView /> },
  { path: '/email-sequences', element: <EmailSequencesView /> },
  { path: '/email-templates', element: <EmailTemplatesView /> },
  { path: '/integrations', element: <IntegrationsView /> },
  { path: '/settings', element: <SettingsView /> },
]
