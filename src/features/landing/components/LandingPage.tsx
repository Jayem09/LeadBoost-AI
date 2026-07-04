import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Database, GitBranch, Zap, ArrowRight, CheckCircle2, Mail, Building2, Phone, DollarSign } from 'lucide-react'

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
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-primary">LeadBoost AI</Link>
          <div className="flex items-center gap-3">
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
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Never lose a lead again.
        </h1>
        <p className="text-lg text-secondary max-w-xl mx-auto mb-8">
          Capture, qualify, and convert leads faster with intelligent automation.
          Built for teams that move fast.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="#lead-form">
            <Button size="lg">
              Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </a>
          <Link to="/login">
            <Button variant="secondary" size="lg">Sign in</Button>
          </Link>
        </div>
        <p className="text-xs text-muted mt-4">No credit card required. 14-day free trial.</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-border bg-card p-6">
              <f.icon className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-secondary">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-primary mb-2">Get started today</h2>
            <p className="text-secondary">Fill out the form and we'll reach out within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Thanks! We'll be in touch.</h3>
              <p className="text-sm text-secondary">Your submission has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Name *</label>
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
                  <label className="text-sm text-secondary mb-1.5 block">Email *</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Company *</label>
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
                  <label className="text-sm text-secondary mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Service Needed</label>
                  <Input
                    placeholder="Web development, consulting..."
                    value={form.serviceNeeded}
                    onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      type="number"
                      placeholder="10000"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-muted">LeadBoost AI</span>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-primary">Pricing</Link>
            <Link to="/about" className="text-xs text-muted hover:text-primary">About</Link>
            <span className="text-xs text-muted">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
