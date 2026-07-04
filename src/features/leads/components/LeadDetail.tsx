import { useParams, useNavigate } from 'react-router-dom'
import { useLeadStore } from '../store/useLeadStore'
import { TopNav } from '@/components/layout/TopNav'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LeadScoreBadge } from '@/components/shared/LeadScoreBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'
import { ArrowLeft, Mail, Phone, Building2, Calendar, DollarSign, Tag, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { LeadForm } from './LeadForm'

export function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { leads, deleteLead } = useLeadStore()
  const [editing, setEditing] = useState(false)

  const lead = leads.find((l) => l.id === id)

  if (!lead) {
    return (
      <div>
        <TopNav title="Lead Not Found" />
        <div className="p-6">
          <Button variant="ghost" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Leads
          </Button>
          <p className="text-secondary mt-4">This lead doesn't exist or has been deleted.</p>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(lead.id)
      navigate('/leads')
    }
  }

  const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div>
      <TopNav title="Lead Detail" subtitle={lead.name} />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Leads
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-accent">{initials}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">{lead.name}</h2>
            <p className="text-sm text-secondary">{lead.company}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <StatusBadge status={lead.status} />
            <LeadScoreBadge score={lead.leadScore} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-primary">{lead.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-primary">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-primary">{lead.company}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-secondary">Budget</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{formatCurrency(lead.budget)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-secondary">Timeline</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{lead.timeline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-secondary">Industry</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{lead.industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Service Needed</span>
                  <span className="text-sm font-medium text-primary">{lead.serviceNeeded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Source</span>
                  <span className="text-sm font-medium text-primary">{lead.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Status</span>
                  <span className="text-sm font-medium text-primary">{STATUS_LABELS[lead.status]}</span>
                </div>
              </CardContent>
            </Card>

            {lead.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary whitespace-pre-wrap">
                  {lead.notes || 'No notes yet.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-success shrink-0" />
                  <div>
                    <p className="text-sm text-primary">Lead created</p>
                    <p className="text-xs text-secondary">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <div>
                    <p className="text-sm text-primary">Last updated</p>
                    <p className="text-xs text-secondary">{formatDate(lead.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LeadForm open={editing} onClose={() => setEditing(false)} lead={lead} />
    </div>
  )
}
