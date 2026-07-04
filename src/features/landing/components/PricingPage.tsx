import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for small teams getting started with lead management.',
    features: [
      'Up to 100 leads',
      'Basic pipeline view',
      'Email notifications',
      '1 user',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
    comingSoon: false,
  },
  {
    name: 'Pro',
    price: '₱1,599',
    period: '/mo',
    description: 'For growing teams that need automation and analytics.',
    features: [
      'Unlimited leads',
      'Full pipeline with drag-and-drop',
      'n8n automation integration',
      'Advanced analytics',
      'Up to 10 users',
      'Email + chat support',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
    comingSoon: true,
  },
  {
    name: 'Enterprise',
    price: '₱4,999',
    period: '/mo',
    description: 'For teams that need full control and custom integrations.',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Priority support',
      'SSO & advanced security',
      'Unlimited users',
      'Dedicated account manager',
      'Custom SLA',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
    comingSoon: true,
  },
]

export function PricingPage() {
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistPlan, setWaitlistPlan] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)

  const handleWaitlist = async (plan: string) => {
    if (!waitlistEmail) {
      setWaitlistPlan(plan)
      return
    }
    setWaitlistLoading(true)
    try {
      await supabase.from('waitlist').insert({
        email: waitlistEmail,
        plan: plan,
      })
      setWaitlistSubmitted(true)
    } catch {
      setWaitlistSubmitted(true)
    } finally {
      setWaitlistLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="LeadBoost AI" className="h-8 w-auto" />
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

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-secondary max-w-xl mx-auto">
          Start free, scale as you grow. No hidden fees. No credit card required.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 flex flex-col ${
                plan.highlighted
                  ? 'border-accent bg-card ring-1 ring-accent/20'
                  : 'border-border bg-card'
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-medium text-accent mb-3">Most Popular</span>
              )}
              <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-bold text-primary">{plan.price}</span>
                {plan.period && <span className="text-sm text-secondary">{plan.period}</span>}
              </div>
              <p className="text-sm text-secondary mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.comingSoon ? (
                <div className="space-y-3">
                  {waitlistSubmitted && waitlistPlan === plan.name ? (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/20 text-success text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      You're on the list! We'll notify you.
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={waitlistPlan === plan.name ? waitlistEmail : ''}
                          onChange={(e) => {
                            setWaitlistEmail(e.target.value)
                            setWaitlistPlan(plan.name)
                          }}
                          className="flex-1 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleWaitlist(plan.name)}
                          disabled={waitlistLoading || !waitlistEmail}
                        >
                          {waitlistLoading ? '...' : 'Notify Me'}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted justify-center">
                        <Clock className="h-3 w-3" />
                        Coming soon — join the waitlist
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/register" className="block">
                  <Button variant="secondary" className="w-full">
                    {plan.cta} <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-primary text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'When will Pro and Enterprise be available?',
                a: 'We\'re launching paid plans soon. Join the waitlist to be the first to know and get early-bird pricing.',
              },
              {
                q: 'Can I upgrade from Starter later?',
                a: 'Absolutely. When paid plans launch, you\'ll be able to upgrade directly from your dashboard.',
              },
              {
                q: 'What payment methods will you accept?',
                a: 'We plan to support credit cards, GCash, Maya, and bank transfers via PayPal.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes. All paid plans will come with a 14-day free trial when they launch.',
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-lg border border-border bg-card p-5">
                <h4 className="text-sm font-semibold text-primary mb-2">{faq.q}</h4>
                <p className="text-sm text-secondary">{faq.a}</p>
              </div>
            ))}
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
