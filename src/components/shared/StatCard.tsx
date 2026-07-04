import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

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
