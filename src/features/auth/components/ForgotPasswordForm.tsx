import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        {!sent ? (
          <>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>

            <h2 className="text-2xl font-semibold text-primary mb-2">Reset your password</h2>
            <p className="text-sm text-secondary mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-secondary mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Check your email</h2>
            <p className="text-sm text-secondary mb-6">
              We sent a password reset link to <span className="text-primary font-medium">{email}</span>
            </p>
            <p className="text-xs text-secondary mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button onClick={() => setSent(false)} className="text-accent hover:underline">
                try again
              </button>
            </p>
            <Link to="/login">
              <Button variant="secondary" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
