import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import {
  Database, GitBranch, Zap, ArrowRight, CheckCircle2, Mail, Building2, Phone, DollarSign,
  BarChart3, Users, Brain, ChevronDown, ChevronUp, Star, Quote, Sparkles, Target,
  TrendingUp
} from 'lucide-react'

const features = [
  { icon: Database, title: 'Lead Capture', description: 'Capture leads from your website, social media, and imports. Never miss a potential customer again.' },
  { icon: GitBranch, title: 'Sales Pipeline', description: 'Visual kanban pipeline with drag-and-drop. Track every lead from first contact to closed deal.' },
  { icon: Zap, title: 'Automation', description: 'Automate follow-ups, email sequences, and notifications. Save hours every week.' },
  { icon: BarChart3, title: 'Smart Analytics', description: 'Real-time dashboards showing conversion rates, revenue forecasts, and team performance.' },
  { icon: Brain, title: 'AI Lead Scoring', description: 'Automatically score and prioritize leads based on engagement and fit. Focus on what matters.' },
  { icon: Users, title: 'Team Collaboration', description: 'Assign leads, track activity, and close deals together. Built for teams that move fast.' },
]

const steps = [
  { num: '01', title: 'Sign up in 30 seconds', description: 'Create your free account. No credit card required. Start importing leads immediately.', icon: Sparkles },
  { num: '02', title: 'Import your leads', description: 'Upload CSV files, connect your website forms, or add leads manually. We handle the rest.', icon: Target },
  { num: '03', title: 'Close more deals', description: 'Use automation, AI scoring, and pipeline management to convert more leads into customers.', icon: TrendingUp },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'Head of Sales', company: 'TechFlow Inc.', quote: 'LeadBoost AI cut our follow-up time by 60%. We closed 40% more deals in the first quarter alone.', rating: 5 },
  { name: 'Marcus Rivera', role: 'CEO', company: 'Growth Studio', quote: 'The pipeline view is a game changer. I can see exactly where every deal stands at a glance. No more lost leads.', rating: 5 },
  { name: 'Emily Watson', role: 'Marketing Director', company: 'ScaleUp Co.', quote: 'We switched from a $200/mo CRM to LeadBoost. Better features, better price, better support. Easy choice.', rating: 5 },
]

const faqs = [
  { q: 'How does the free trial work?', a: 'Start your 14-day free trial with full access to all Pro features. No credit card required. Upgrade, downgrade, or cancel anytime.' },
  { q: 'Can I import leads from my existing CRM?', a: 'Yes! Export your leads as CSV and import them directly. We support all major CRM formats including Salesforce, HubSpot, and Pipedrive.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use Supabase with enterprise-grade encryption, Row Level Security, and SOC 2 compliance. Your data is encrypted at rest and in transit.' },
  { q: 'Can I connect my email for automation?', a: 'Yes! Connect Gmail, Outlook, or any SMTP provider. Set up automated email sequences, follow-ups, and notifications in minutes.' },
  { q: 'Do you offer phone support?', a: 'Pro and Enterprise plans include priority email support with 24-hour response times. Enterprise plans also include phone and video support.' },
]

const stats = [
  { value: '500+', label: 'Businesses' },
  { value: '50K+', label: 'Leads Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '40%', label: 'More Deals Closed' },
]

export function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', serviceNeeded: '', budget: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="LeadBoost AI" className="h-12 w-auto mix-blend-multiply dark:mix-blend-screen" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing"><Button variant="ghost" size="sm">Pricing</Button></Link>
            <Link to="/about"><Button variant="ghost" size="sm">About</Button></Link>
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
              <Zap className="h-3 w-3" />
              Now in public beta
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight leading-[1.1]">
              Never lose a<br />lead again.
            </h1>
            <p className="text-xl text-secondary mb-8 leading-relaxed max-w-lg">
              Capture, qualify, and convert leads faster with intelligent automation. Built for teams that move fast.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a href="#lead-form">
                <Button size="lg" className="text-base px-8">Start Free Trial <ArrowRight className="h-5 w-5 ml-2" /></Button>
              </a>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="text-base px-8">Sign in</Button>
              </Link>
            </div>
            <p className="text-sm text-muted">No credit card required. 14-day free trial.</p>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-secondary">Free for small teams</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-secondary">Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-secondary">No lock-in</span>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative hidden lg:block">
            <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="h-8 border-b border-border bg-card/50 px-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="text-xs text-muted ml-2">LeadBoost AI — Dashboard</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total Leads', value: '1,247', color: 'text-primary' },
                    { label: 'Hot Leads', value: '89', color: 'text-orange-500' },
                    { label: 'Conversion', value: '24.8%', color: 'text-success' },
                    { label: 'Revenue', value: '₱2.4M', color: 'text-accent' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted">{s.label}</div>
                      <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted mb-2">Recent Leads</div>
                  {['Maria Santos — TechFlow', 'James Reid — ScaleUp', 'Ana Cruz — Growth Studio'].map((l) => (
                    <div key={l} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">{l[0]}</div>
                      <span className="text-xs text-primary">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -top-4 -left-4 h-16 w-16 bg-accent/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-center text-sm text-muted mb-6">Trusted by 500+ businesses worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30">
            {['TechFlow', 'Growth Studio', 'ScaleUp Co', 'CloudBase', 'DataSync', 'Nexus'].map((name) => (
              <span key={name} className="text-lg font-bold text-primary">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
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
          <p className="text-secondary max-w-xl mx-auto">From lead capture to closed deal — one platform to manage it all.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 hover:border-accent/30 transition-colors group">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Up and running in minutes</h2>
            <p className="text-secondary max-w-xl mx-auto">Three simple steps to start closing more deals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t border-dashed border-border" />
                )}
                <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 relative z-10">
                  <s.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="text-xs font-bold text-accent mb-2">STEP {s.num}</div>
                <h3 className="text-lg font-semibold text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-secondary leading-relaxed max-w-xs mx-auto">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Loved by sales teams</h2>
          <p className="text-secondary max-w-xl mx-auto">Don't take our word for it. Here's what our customers say.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-6 hover:border-accent/30 transition-colors">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-accent/30 mb-3" />
              <p className="text-sm text-primary leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{t.name}</div>
                  <div className="text-xs text-secondary">{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Frequently asked questions</h2>
            <p className="text-secondary">Everything you need to know about LeadBoost AI.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-primary">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-secondary shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-secondary shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-secondary leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="rounded-2xl bg-accent/5 border border-accent/20 p-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Ready to boost your leads?</h2>
            <p className="text-secondary max-w-lg mx-auto mb-8">
              Join 500+ businesses already using LeadBoost AI to close more deals. Start your free trial today.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#lead-form">
                <Button size="lg" className="text-base px-8">Start Free Trial <ArrowRight className="h-5 w-5 ml-2" /></Button>
              </a>
              <Link to="/pricing">
                <Button variant="secondary" size="lg" className="text-base px-8">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form">
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
                <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Name *</label>
                  <Input required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input required type="email" placeholder="john@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-9" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Company *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input required placeholder="Acme Corp" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="pl-9" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input placeholder="+63 917 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-9" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Service Needed</label>
                  <Input placeholder="Web development, consulting..." value={form.serviceNeeded} onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Budget (₱)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input type="number" placeholder="50000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="pl-9" />
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
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/Logo.png" alt="LeadBoost AI" className="h-10 w-auto mix-blend-multiply dark:mix-blend-screen" />
              </div>
              <p className="text-xs text-secondary leading-relaxed">Capture, qualify, and convert leads faster with intelligent automation.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Product</h4>
              <div className="space-y-2">
                <Link to="/pricing" className="block text-xs text-secondary hover:text-primary">Pricing</Link>
                <Link to="/about" className="block text-xs text-secondary hover:text-primary">About</Link>
                <a href="#lead-form" className="block text-xs text-secondary hover:text-primary">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Legal</h4>
              <div className="space-y-2">
                <span className="block text-xs text-secondary">Privacy Policy</span>
                <span className="block text-xs text-secondary">Terms of Service</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Connect</h4>
              <div className="space-y-2">
                <span className="block text-xs text-secondary">Twitter</span>
                <span className="block text-xs text-secondary">LinkedIn</span>
                <span className="block text-xs text-secondary">GitHub</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted">&copy; {new Date().getFullYear()} LeadBoost AI. All rights reserved.</span>
            <div className="flex items-center gap-1 text-xs text-muted">
              Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> in the Philippines
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}
