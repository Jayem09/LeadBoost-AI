import { TopNav } from '@/components/layout/TopNav'
import { TemplateList } from './TemplateList'

export function EmailTemplatesView() {
  return (
    <div>
      <TopNav title="Email Templates" subtitle="Create and manage email templates" />
      <div className="p-6 max-w-3xl">
        <TemplateList />
      </div>
    </div>
  )
}
