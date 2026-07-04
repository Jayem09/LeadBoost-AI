import { useMemo } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Flame, TrendingUp, DollarSign, Globe, Code, Megaphone, Headphones, Palette, Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useLeadStore } from '@/features/leads/store/useLeadStore'
import { formatCurrency } from '@/lib/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STATUS_COLORS: Record<string, string> = {
  new: '#22C55E',
  qualified: '#2563EB',
  contacted: '#F59E0B',
  meeting: '#8B5CF6',
  proposal: '#EC4899',
  won: '#10B981',
  lost: '#EF4444',
}

const services = [
  { icon: Globe, name: 'Web Development', desc: 'Custom websites & web apps', color: '#6366f1' },
  { icon: Code, name: 'Software Solutions', desc: 'Tailored software development', color: '#2563EB' },
  { icon: Megaphone, name: 'Digital Marketing', desc: 'SEO, ads & social media', color: '#F59E0B' },
  { icon: Palette, name: 'UI/UX Design', desc: 'Beautiful, user-friendly interfaces', color: '#EC4899' },
  { icon: Headphones, name: 'IT Support', desc: '24/7 technical assistance', color: '#10B981' },
  { icon: Shield, name: 'Cybersecurity', desc: 'Protect your digital assets', color: '#EF4444' },
]

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function DashboardView() {
  const { leads } = useLeadStore()

  const stats = useMemo(() => {
    const total = leads.length
    const hot = leads.filter((l) => l.leadScore >= 70).length
    const won = leads.filter((l) => l.status === 'won').length
    const rate = total > 0 ? ((won / total) * 100).toFixed(1) : '0'
    const revenue = leads.filter((l) => l.status === 'won').reduce((sum, l) => sum + (l.budget || 0), 0)
    return { total, hot, rate, revenue }
  }, [leads])

  const chartData = useMemo(() => {
    const now = new Date()
    const data = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = MONTHS[d.getMonth()]
      const year = d.getFullYear()
      const count = leads.filter((l) => {
        const created = new Date(l.createdAt)
        return created.getMonth() === d.getMonth() && created.getFullYear() === year
      }).length
      data.push({ month, leads: count })
    }
    return data
  }, [leads])

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [leads])

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [leads])

  return (
    <div>
      <TopNav title="Dashboard" subtitle="Here's your overview" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value={stats.total.toString()} trend={{ value: `${stats.total} total`, positive: true }} icon={Users} />
          <StatCard title="Hot Leads" value={stats.hot.toString()} trend={{ value: stats.hot > 0 ? 'Needs attention' : 'All good', positive: stats.hot === 0 }} icon={Flame} />
          <StatCard title="Conversion Rate" value={`${stats.rate}%`} trend={{ value: `${stats.rate}% won`, positive: parseFloat(stats.rate) > 0 }} icon={TrendingUp} />
          <StatCard title="Revenue" value={formatCurrency(stats.revenue)} trend={{ value: formatCurrency(stats.revenue), positive: stats.revenue > 0 }} icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leads Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-secondary text-sm">
                  No leads yet. Add your first lead to see data here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: 8 }}
                      labelStyle={{ color: '#FAFAFA' }}
                    />
                    <Bar dataKey="leads" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {statusBreakdown.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-secondary text-sm">
                  No data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {statusBreakdown.map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] || '#71717A' }} />
                        <span className="text-sm text-primary capitalize">{status}</span>
                      </div>
                      <span className="text-sm font-medium text-secondary">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="py-8 text-center text-secondary text-sm">
                No recent activity. Add a lead to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[lead.status] || '#71717A' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary">{lead.name} — {lead.company}</p>
                      <p className="text-xs text-secondary">{lead.email}</p>
                    </div>
                    <span className="text-xs text-secondary shrink-0">{formatTimeAgo(new Date(lead.createdAt))}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3">Your Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.name} className="rounded-lg border border-border bg-card p-4 hover:border-accent/30 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${service.color}15` }}>
                    <service.icon className="h-5 w-5" style={{ color: service.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary">{service.name}</h4>
                    <p className="text-xs text-secondary mt-0.5">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
