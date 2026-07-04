import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Firebase auth will go here
    console.log('Login:', { email, password })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-background items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-primary mb-4">LeadBoost AI</h1>
          <p className="text-xl text-primary mb-2">Never lose a lead again.</p>
          <p className="text-secondary">
            Capture, qualify, and convert leads faster with intelligent automation.
          </p>
          <p className="text-xs text-muted mt-8">Trusted by 500+ businesses worldwide</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-primary mb-2">Welcome back</h2>
          <p className="text-sm text-secondary mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-secondary mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-secondary mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-secondary">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-secondary">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full">
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full">
              Continue with GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline">Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
