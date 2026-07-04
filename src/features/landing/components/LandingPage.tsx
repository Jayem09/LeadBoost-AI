import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Database, GitBranch, Zap, ArrowRight, CheckCircle2, Mail, Building2, Phone, DollarSign, BarChart3, Shield, Users } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: 'Lead Capture',
    description: 'Capture leads from your website and manage them in one place. Never miss a potential customer.',
  },
  {
    icon: GitBranch,
    title: 'Sales Pipeline',
    description: 'Visual pipeline with drag-and-drop. Track every lead from first contact to closed deal.',
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Connect to n8n and automate follow-ups, notifications, and workflows.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Real-time dashboards and reports. Know exactly where your leads are coming from.',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Enterprise-grade security with Supabase. Your data is encrypted and protected.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Assign leads, track activity, and close deals together. Built for teams.',
  },
]

const stats = [
  { value: '500+', label: 'Businesses' },
  { value: '50K+', label: 'Leads Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

export function LandingPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceNeeded: '',
    budget: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { error: insertError } = await supabase.from('leads').insert({
        name: form.name,
        email: form.email,
        company: form.company,
        phone: form.phone,
        service_needed: form.serviceNeeded,
        budget: parseInt(form.budget) || 0,
        source: 'Website',
        status: 'new',
        user_id: null,
      })

      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="LeadBoost AI" className="h-8 w-8" />
            <span className="text-lg font-bold text-primary">LeadBoost AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
          <Zap className="h-3 w-3" />
          Now in public beta
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
          Never lose a<br />lead again.
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Capture, qualify, and convert leads faster with intelligent automation.
          Built for teams that move fast.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="#lead-form">
            <Button size="lg" className="text-base px-8">
              Start Free Trial <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </a>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="text-base px-8">Sign in</Button>
          </Link>
        </div>
        <p className="text-sm text-muted mt-6">No credit card required. 14-day free trial.</p>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Everything you need to close deals</h2>
          <p className="text-secondary max-w-xl mx-auto">
            From lead capture to closed deal — one platform to manage it all.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 hover:border-accent/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-sm text-muted mb-8">Trusted by teams worldwide</p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            {['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Stark'].map((name) => (
              <span key={name} className="text-lg font-bold text-primary">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-4">Get started today</h2>
            <p className="text-secondary">Fill out the form and we'll reach out within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Thanks! We'll be in touch.</h3>
              <p className="text-secondary">Your submission has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-5">
              {error && (
                <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Name *</label>
                  <div className="relative">
                    <Input
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      required
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Company *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      required
                      placeholder="Acme Corp"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      placeholder="+63 917 000 0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Service Needed</label>
                  <Input
                    placeholder="Web development, consulting..."
                    value={form.serviceNeeded}
                    onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Budget (₱)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      type="number"
                      placeholder="50000"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="LeadBoost AI" className="h-6 w-6" />
              <span className="text-sm font-semibold text-primary">LeadBoost AI</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/pricing" className="text-sm text-secondary hover:text-primary">Pricing</Link>
              <Link to="/about" className="text-sm text-secondary hover:text-primary">About</Link>
              <Link to="/login" className="text-sm text-secondary hover:text-primary">Sign in</Link>
            </div>
            <span className="text-xs text-muted">&copy; {new Date().getFullYear()} LeadBoost AI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
