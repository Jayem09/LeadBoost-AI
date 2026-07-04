import type { ReactNode } from 'react'
import { useRoleStore } from '../store/useRoleStore'
import { ShieldAlert } from 'lucide-react'

interface RoleGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ permission, children, fallback }: RoleGuardProps) {
  const { hasPermission, loading } = useRoleStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-secondary">Checking permissions...</div>
      </div>
    )
  }

  if (!hasPermission(permission as Parameters<typeof hasPermission>[0])) {
    if (fallback) return <>{fallback}</>

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
        <ShieldAlert className="h-12 w-12 text-danger mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-2">Access Denied</h3>
        <p className="text-sm text-secondary max-w-sm">
          You don't have the <span className="font-medium text-primary">{permission}</span> permission to view this content.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
