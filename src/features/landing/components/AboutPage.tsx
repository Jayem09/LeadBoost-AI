import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Database, GitBranch, Zap, Shield, Users, Globe } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'Your data is encrypted at rest and in transit. We use industry-standard security practices and never sell your data.',
  },
  {
    icon: Users,
    title: 'Built for Teams',
    description: 'Collaborate in real-time. Assign leads, track activity, and close deals together — from anywhere.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Access LeadBoost AI from any device, anywhere in the world. No installs, no downloads — just open your browser.',
  },
]

const stats = [
  { value: '500+', label: 'Businesses' },
  { value: '50K+', label: 'Leads Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="LeadBoost AI" className="h-10 w-auto mix-blend-multiply dark:mix-blend-screen" />
          </Link>
          <div className="flex items-center gap-3">
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
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">We help teams close more deals</h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          LeadBoost AI was built to solve a simple problem: too many leads fall through the cracks.
          We give sales teams the tools to capture, track, and convert every opportunity.
        </p>
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

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-secondary mb-6">
            We believe every business deserves a simple, powerful way to manage their sales pipeline.
            No bloated CRMs, no confusing spreadsheets — just a clean, fast tool that gets out of your way
            and lets you focus on what matters: closing deals.
          </p>
          <p className="text-secondary">
            Founded in 2026, LeadBoost AI combines intelligent automation with a beautiful interface
            to help small and mid-size teams compete with the big players.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-primary text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg border border-border bg-card p-6">
                <v.icon className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">{v.title}</h3>
                <p className="text-sm text-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-primary text-center mb-4">Built with Modern Tech</h2>
          <p className="text-secondary text-center mb-10 max-w-xl mx-auto">
            We use the best tools in the industry to deliver a fast, reliable experience.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Database, name: 'Supabase', desc: 'Database & Auth' },
              { icon: GitBranch, name: 'React + TypeScript', desc: 'Frontend' },
              { icon: Zap, name: 'n8n', desc: 'Workflow Automation' },
            ].map((tech) => (
              <div key={tech.name} className="rounded-lg border border-border bg-card p-5 text-center">
                <tech.icon className="h-6 w-6 text-accent mx-auto mb-3" />
                <div className="text-sm font-semibold text-primary">{tech.name}</div>
                <div className="text-xs text-secondary mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to get started?</h2>
          <p className="text-secondary mb-6">
            Join 500+ businesses already using LeadBoost AI to close more deals.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg">Start Free Trial <Zap className="h-4 w-4 ml-2" /></Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-muted">LeadBoost AI</span>
          <span className="text-xs text-muted">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
