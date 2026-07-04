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
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    const handleNav = () => setMobileOpen(false)
    window.addEventListener('popstate', handleNav)
    return () => window.removeEventListener('popstate', handleNav)
  }, [])

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <span className="text-sm font-semibold text-primary">LeadBoost AI</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 text-secondary hover:text-primary hidden md:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-md p-1 text-secondary hover:text-primary md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={() => setMobileOpen(false)}
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
            onClick={() => setMobileOpen(false)}
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
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 rounded-md p-2 text-secondary hover:text-primary bg-card border border-border md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-16' : 'w-[220px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex h-screen flex-col border-r border-border bg-card transition-all duration-200',
          collapsed ? 'w-16' : 'w-[220px]'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
