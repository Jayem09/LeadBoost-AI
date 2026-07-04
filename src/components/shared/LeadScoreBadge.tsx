import { LEAD_SCORE_RANGES } from '@/lib/constants'

interface LeadScoreBadgeProps {
  score: number
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  const range = LEAD_SCORE_RANGES.find(
    (r) => score >= r.min && score <= r.max
  ) || LEAD_SCORE_RANGES[0]

  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{ borderColor: range.color, color: range.color }}
    >
      {range.label} ({score})
    </span>
  )
}
