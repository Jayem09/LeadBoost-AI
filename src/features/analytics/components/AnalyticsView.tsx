import { TopNav } from '@/components/layout/TopNav'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Target, DollarSign } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'

const monthlyData = [
  { month: 'Jan', leads: 65 }, { month: 'Feb', leads: 85 },
  { month: 'Mar', leads: 72 }, { month: 'Apr', leads: 110 },
  { month: 'May', leads: 95 }, { month: 'Jun', leads: 128 },
  { month: 'Jul', leads: 115 }, { month: 'Aug', leads: 140 },
  { month: 'Sep', leads: 132 }, { month: 'Oct', leads: 155 },
  { month: 'Nov', leads: 148 }, { month: 'Dec', leads: 170 },
]

const sourceData = [
  { name: 'Website', value: 40, color: '#2563EB' },
  { name: 'Referral', value: 25, color: '#22C55E' },
  { name: 'Social', value: 20, color: '#F59E0B' },
  { name: 'Direct', value: 15, color: '#8B5CF6' },
]

const pipelineData = [
  { status: 'New', count: 45 }, { status: 'Qualified', count: 32 },
  { status: 'Contacted', count: 28 }, { status: 'Meeting', count: 15 },
  { status: 'Proposal', count: 12 }, { status: 'Won', count: 22 },
  { status: 'Lost', count: 8 },
]

const scoreData = [
  { range: 'Cold', count: 180 }, { range: 'Warm', count: 320 },
  { range: 'Hot', count: 240 }, { range: 'Super Hot', count: 85 },
  { range: 'Elite', count: 35 },
]

export function AnalyticsView() {
  return (
    <div>
      <TopNav title="Analytics" subtitle="Track your performance and conversion metrics" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value="1,284" trend={{ value: '12.5%', positive: true }} icon={Users} />
          <StatCard title="Conversion Rate" value="24.8%" trend={{ value: '3.2%', positive: true }} icon={TrendingUp} />
          <StatCard title="Avg Lead Score" value="34.2" trend={{ value: '1.8%', positive: false }} icon={Target} />
          <StatCard title="Revenue" value="$84,250" trend={{ value: '18.7%', positive: true }} icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leads Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="leads" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {sourceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2">
                {sourceData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-secondary">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pipelineData} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <YAxis type="category" dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreData}>
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
