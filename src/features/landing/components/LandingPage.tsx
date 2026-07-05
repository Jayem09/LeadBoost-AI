import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import {
  Database, Zap, ArrowRight, CheckCircle2,
  BarChart3, Users, Brain, ChevronDown, ChevronUp, Star, Quote, Sparkles, Target,
  TrendingUp, Layers, Rocket, Shield, Play, Menu, X
} from 'lucide-react'

const features = [
  { icon: Database, title: 'Smart Lead Capture', description: 'Capture leads from your website, social media, CSV imports, and manual entry. All in one place.', color: '#6366f1' },
  { icon: Layers, title: 'Visual Pipeline', description: 'Drag-and-drop kanban board. Move leads through stages and never drop a ball again.', color: '#2563eb' },
  { icon: Zap, title: 'Auto Workflows', description: 'Connect n8n and automate follow-ups, email sequences, Slack alerts, and more.', color: '#f59e0b' },
  { icon: BarChart3, title: 'Real-time Analytics', description: 'Conversion rates, revenue forecasts, team performance — updated in real time.', color: '#10b981' },
  { icon: Brain, title: 'AI Lead Scoring', description: 'Auto-prioritize leads based on engagement, budget, and fit score.', color: '#ec4899' },
  { icon: Users, title: 'Team Sync', description: 'Assign leads, leave notes, track activity, and collaborate in real time.', color: '#8b5cf6' },
]

const steps = [
  { num: '01', icon: Rocket, title: 'Sign up — it\'s free', description: 'Create your account in 30 seconds. No credit card needed.' },
  { num: '02', icon: Target, title: 'Import your leads', description: 'Upload CSV, connect your website form, or add manually.' },
  { num: '03', icon: TrendingUp, title: 'Start closing deals', description: 'Use automation and AI scoring to convert faster.' },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'Head of Sales', company: 'TechFlow Inc.', avatar: 'SC',
    quote: '"Cut our follow-up time by 60% and closed 40% more deals in the first quarter. The pipeline view alone is worth it."',
    rating: 5, color: '#6366f1' },
  { name: 'Marcus Rivera', role: 'CEO', company: 'Growth Studio', avatar: 'MR',
    quote: '"Switched from a $200/mo CRM. LeadBoost does everything better for a fraction of the price. Easy decision."',
    rating: 5, color: '#10b981' },
  { name: 'Emily Watson', role: 'Marketing Director', company: 'ScaleUp Co.', avatar: 'EW',
    quote: '"I can see exactly where every lead is at a glance. No more lost opportunities slipping through the cracks."',
    rating: 5, color: '#ec4899' },
]

const faqs = [
  { q: 'How does the free trial work?', a: '14-day full access to all Pro features. No credit card required. Cancel anytime.' },
  { q: 'Can I import from my current CRM?', a: 'Yes — export from Salesforce, HubSpot, or Pipedrive as CSV and import directly.' },
  { q: 'Is my data secure?', a: 'Enterprise-grade encryption with Supabase, RLS policies, and SOC 2 compliance.' },
  { q: 'Can I automate emails?', a: 'Connect Gmail, Outlook, or any SMTP. Set up sequences, follow-ups, and drip campaigns.' },
  { q: 'Do you offer support?', a: 'Pro includes priority email (24h response). Enterprise adds phone and video support.' },
]

export function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', serviceNeeded: '', budget: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileNav, setMobileNav] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('leads').insert({
        name: form.name, email: form.email, company: form.company, phone: form.phone,
        service_needed: form.serviceNeeded, budget: parseInt(form.budget) || 0,
        source: 'Website', status: 'new', user_id: null,
      })
      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="LeadBoost AI" className="h-20 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 font-medium">About</Link>
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Sign in</Link>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            <Link to="/pricing" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileNav(false)}>Pricing</Link>
            <Link to="/about" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileNav(false)}>About</Link>
            <Link to="/login" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileNav(false)}>Sign in</Link>
            <Link to="/register" onClick={() => setMobileNav(false)}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-50/80 to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-50/60 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Free for small teams
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.05]">
                Never lose a<br />
                <span className="text-indigo-600">lead again.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-lg leading-relaxed">
                Capture, qualify, and convert leads faster with intelligent automation, AI scoring, and a beautiful pipeline that your team will actually enjoy using.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
                <a href="#lead-form">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-base px-8 h-12 shadow-lg shadow-indigo-200">
                    Start Free Trial <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </a>
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="text-base px-8 h-12 border-gray-200 hover:bg-gray-50">
                    <Play className="h-4 w-4 mr-2" /> Watch Demo
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-400 mb-8">No credit card required · 14-day free trial · Cancel anytime</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">Free for small teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">Setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">No lock-in</span>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-indigo-100/50 overflow-hidden">
                {/* Window chrome */}
                <div className="h-10 bg-gray-50 border-b border-gray-200 px-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400 ml-2 font-mono">dashboard.leadboost.ai</span>
                </div>
                {/* Content */}
                <div className="p-5 space-y-5">
                  {/* Stat cards row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Total Leads', value: '1,247', change: '+12%', up: true },
                      { label: 'Hot Leads', value: '89', change: '+5%', up: true },
                      { label: 'Conversion', value: '24.8%', change: '+3.2%', up: true },
                      { label: 'Revenue', value: '₱2.4M', change: '+18%', up: true },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                        <div className="text-xl font-bold text-gray-900 mt-1">{s.value}</div>
                        <div className={`text-xs font-medium mt-0.5 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>{s.change}</div>
                      </div>
                    ))}
                  </div>
                  {/* Pipeline preview */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'New', count: 48, color: 'bg-emerald-500' },
                      { label: 'Contacted', count: 32, color: 'bg-blue-500' },
                      { label: 'Meeting', count: 18, color: 'bg-purple-500' },
                      { label: 'Proposal', count: 12, color: 'bg-pink-500' },
                      { label: 'Won', count: 24, color: 'bg-emerald-500' },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="h-1.5 w-full rounded-full bg-gray-100 mb-2">
                          <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${(s.count / 48) * 100}%` }} />
                        </div>
                        <div className="text-xs font-semibold text-gray-700">{s.count}</div>
                        <div className="text-[10px] text-gray-400">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Recent leads */}
                  <div className="space-y-1.5">
                    {[
                      { name: 'Maria Santos', company: 'TechFlow Inc.', status: 'New', score: 92 },
                      { name: 'James Reid', company: 'ScaleUp Co.', status: 'Meeting', score: 78 },
                      { name: 'Ana Cruz', company: 'Growth Studio', status: 'Proposal', score: 95 },
                    ].map((l) => (
                      <div key={l.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                            {l.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{l.name}</div>
                            <div className="text-xs text-gray-400">{l.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            l.status === 'New' ? 'bg-emerald-50 text-emerald-700' :
                            l.status === 'Meeting' ? 'bg-purple-50 text-purple-700' : 'bg-pink-50 text-pink-700'
                          }`}>{l.status}</span>
                          <span className="text-xs font-bold text-indigo-600">{l.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-indigo-100/50 rounded-full blur-3xl" />
              <div className="absolute -top-4 -left-4 h-20 w-20 bg-purple-100/50 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 hidden xl:flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-600">1,247 leads tracked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOGOS ─── */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest mb-6">Trusted by sales teams worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {['TechFlow', 'Growth Studio', 'ScaleUp Co', 'CloudBase', 'DataSync', 'Nexus'].map((name) => (
              <span key={name} className="text-lg font-bold text-gray-300 hover:text-gray-400 transition-colors">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Active Businesses', desc: 'And growing every day' },
            { value: '50K+', label: 'Leads Managed', desc: 'Across all platforms' },
            { value: '99.9%', label: 'Uptime SLA', desc: 'Enterprise reliability' },
            { value: '4.9★', label: 'Average Rating', desc: 'From customer reviews' },
          ].map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="text-4xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
              <Zap className="h-3 w-3" /> Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to close deals</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              From first touch to closed won — one platform to manage your entire sales pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-200">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${f.color}10` }}
                >
                  <f.icon className="h-6 w-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
            <Rocket className="h-3 w-3" /> Quick start
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Up and running in 2 minutes</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">No onboarding calls. No complex setup. Just sign up and go.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
              )}
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                <s.icon className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW FULL ─── */}
      <section className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold mb-4">
                <BarChart3 className="h-3 w-3 text-indigo-400" /> Analytics
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Know your numbers</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Real-time dashboards show you conversion rates, revenue forecasts, lead sources, and team performance. No spreadsheets needed.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Conversion Rate', 'Revenue Forecast', 'Lead Sources', 'Team Stats'].map((label) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-gray-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden shadow-2xl">
              <div className="h-8 bg-gray-800 border-b border-gray-700 px-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 rounded-xl bg-gray-700/50 p-4">
                    <div className="text-xs text-gray-400 mb-2">Conversion Trend</div>
                    <svg viewBox="0 0 200 60" className="w-full h-10">
                      <path d="M0 50 Q20 45 40 48 Q60 30 80 35 Q100 15 120 20 Q140 10 160 12 Q180 5 200 8" fill="none" stroke="#6366f1" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="h-32 rounded-xl bg-gray-700/50 p-4">
                    <div className="text-xs text-gray-400 mb-2">Revenue</div>
                    <div className="text-2xl font-bold text-white">₱2.4M</div>
                    <div className="text-xs text-emerald-400">↑ 18% this quarter</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Email', pct: 45, color: 'bg-indigo-500' },
                    { label: 'Website', pct: 30, color: 'bg-emerald-500' },
                    { label: 'Referral', pct: 25, color: 'bg-purple-500' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-gray-700/50 p-4">
                      <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                      <div className="text-lg font-bold text-white">{s.pct}%</div>
                      <div className="h-1.5 w-full rounded-full bg-gray-700 mt-2">
                        <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
            <Quote className="h-3 w-3" /> Testimonials
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by sales teams</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">Real feedback from real customers who transformed their sales process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-200">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURE HIGHLIGHT SECTION ─── */}
      <section className="bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant, encrypted at rest and in transit with Supabase RLS.', color: '#6366f1' },
              { icon: Users, title: 'Team Collaboration', desc: 'Real-time sync. Assign leads, leave notes, and track every interaction.', color: '#10b981' },
              { icon: Zap, title: 'n8n Automation', desc: 'Connect to 200+ apps via n8n. Automate emails, Slack, SMS, and more.', color: '#f59e0b' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-gray-200 transition-all">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${item.color}10` }}>
                  <item.icon className="h-6 w-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
            <Zap className="h-3 w-3" /> FAQ
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <p className="text-gray-500">Everything you need to know about LeadBoost AI.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:border-gray-200 transition-colors">
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to boost your leads?</h2>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-10">
            Join 500+ businesses already using LeadBoost AI to capture, manage, and convert more leads.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#lead-form">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 text-base px-10 h-12 shadow-xl">
                Start Free Trial <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </a>
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="text-white border-indigo-400 hover:bg-indigo-500/30 text-base px-10 h-12">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LEAD FORM ─── */}
      <section id="lead-form" className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Get started today</h2>
            <p className="text-gray-500">Fill out the form and we'll reach out within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-12 text-center">
              <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thanks! We'll be in touch. 🎉</h3>
              <p className="text-gray-500">Your submission has been received. Our team will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-gray-50 p-8 space-y-5 shadow-sm">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name *</label>
                  <Input required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white border-gray-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
                  <Input required type="email" placeholder="john@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white border-gray-200 pl-9" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Company *</label>
                  <Input required placeholder="Acme Corp" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-white border-gray-200 pl-9" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                  <Input placeholder="+63 917 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white border-gray-200 pl-9" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Service Needed</label>
                  <Input placeholder="Web development, consulting..." value={form.serviceNeeded} onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })} className="bg-white border-gray-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Budget (₱)</label>
                  <Input type="number" placeholder="50000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="bg-white border-gray-200 pl-9" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12" size="lg" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <img src="/Logo.png" alt="LeadBoost AI" className="h-16 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed">Capture, qualify, and convert leads faster with intelligent automation.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2.5">
                <Link to="/pricing" className="block text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link to="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">About</Link>
                <a href="#lead-form" className="block text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2.5">
                <span className="block text-sm text-gray-400">Privacy Policy</span>
                <span className="block text-sm text-gray-400">Terms of Service</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-2.5">
                <span className="block text-sm text-gray-400">Twitter / X</span>
                <span className="block text-sm text-gray-400">LinkedIn</span>
                <span className="block text-sm text-gray-400">GitHub</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LeadBoost AI. All rights reserved.</span>
            <span className="text-sm text-gray-500">Made with ❤️ in the Philippines</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
