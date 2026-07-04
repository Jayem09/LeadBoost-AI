import { TopNav } from '@/components/layout/TopNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import { CustomFieldManager } from '@/features/custom-fields/components/CustomFieldManager'
import { ApiKeyManager } from '@/features/api-keys/components/ApiKeyManager'
import { RoleGuard } from '@/features/auth/components/RoleGuard'

export function SettingsView() {
  return (
    <div>
      <TopNav title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-6">
        <div className="flex gap-8 max-w-4xl">
          <nav className="w-48 shrink-0 space-y-1">
            {['Account', 'Company', 'Notifications', 'Lead Scoring', 'Team Members', 'Integrations'].map((item, i) => (
              <button
                key={item}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  i === 1
                    ? 'bg-accent/10 text-accent'
                    : 'text-secondary hover:bg-card hover:text-primary'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Company Name</label>
                  <Input defaultValue="Acme Corp" />
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Website</label>
                  <Input defaultValue="https://acme.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary mb-1.5 block">Industry</label>
                    <select className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary">
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Real Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-secondary mb-1.5 block">Company Size</label>
                    <select className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary">
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201+ employees</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-accent border border-border" />
                    <Input defaultValue="#2563EB" className="w-32" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Logo</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <p className="text-sm text-secondary">Upload logo</p>
                    <p className="text-xs text-muted mt-1">SVG, PNG or JPG (max 2MB)</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1.5 block">Company Tagline</label>
                  <Input defaultValue="Innovating since 2024" />
                </div>
              </CardContent>
            </Card>

            <CustomFieldManager />

            <RoleGuard permission="manage_settings">
              <ApiKeyManager />
            </RoleGuard>

            <div className="flex justify-end gap-3">
              <Button variant="secondary">Cancel</Button>
              <Button>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
