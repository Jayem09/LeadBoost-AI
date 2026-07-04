import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

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
  },
  {
    name: 'Pro',
    price: '$29',
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
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
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
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-primary">LeadBoost AI</Link>
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

              <Link to="/register" className="block">
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
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
                q: 'Can I switch plans later?',
                a: 'Yes. Upgrade or downgrade anytime from your settings. Changes take effect immediately with prorated billing.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, Amex) via Stripe.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes. All paid plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. Cancel from your dashboard anytime — no contracts, no cancellation fees.',
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
