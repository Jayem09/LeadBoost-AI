import { TopNav } from '@/components/layout/TopNav'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Flame, TrendingUp, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { month: 'Jan', leads: 45 },
  { month: 'Feb', leads: 72 },
  { month: 'Mar', leads: 58 },
  { month: 'Apr', leads: 95 },
  { month: 'May', leads: 68 },
  { month: 'Jun', leads: 88 },
]

const activities = [
  { color: '#22C55E', text: 'New lead: Acme Corp', time: '2h ago' },
  { color: '#2563EB', text: 'Deal won: TechStart', time: '4h ago' },
  { color: '#F59E0B', text: 'Meeting scheduled', time: '6h ago' },
  { color: '#8B5CF6', text: 'Lead qualified: NovaTech', time: '1d ago' },
  { color: '#EC4899', text: 'Proposal sent: BioGen', time: '2d ago' },
]

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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leads Overview</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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
        </div>
      </div>
    </div>
  )
}
