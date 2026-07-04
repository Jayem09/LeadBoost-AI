import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSearchStore } from '../store/useSearchStore'
import { useDebounce } from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'
import { STATUS_LABELS, INDUSTRIES, LEAD_SOURCES } from '@/lib/constants'
import type { LeadStatus } from '@/types'

export function AdvancedSearch() {
  const {
    query,
    filters,
    sortBy,
    sortDirection,
    setQuery,
    setFilter,
    clearFilters,
    setSort,
    hasActiveFilters,
    activeFilterCount,
  } = useSearchStore()

  const [showFilters, setShowFilters] = useState(false)
  const [localQuery, setLocalQuery] = useState(query)
  const debouncedQuery = useDebounce(localQuery, 300)

  useEffect(() => {
    setQuery(debouncedQuery)
  }, [debouncedQuery, setQuery])

  const filterCount = activeFilterCount()

  return (
    <div className="space-y-3">
      {/* Search bar row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <Input
            placeholder="Search by name, email, or company..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {localQuery && (
            <button
              onClick={() => {
                setLocalQuery('')
                setQuery('')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Filters
          {filterCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full px-1 text-[10px]"
            >
              {filterCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Expandable filter row */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 p-4 rounded-lg border border-border bg-card/50">
          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilter('status', e.target.value as LeadStatus | 'all')
                }
                className="h-9 w-40 appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="all">All Statuses</option>
                {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary pointer-events-none" />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Industry</label>
            <div className="relative">
              <select
                value={filters.industry}
                onChange={(e) => setFilter('industry', e.target.value)}
                className="h-9 w-40 appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary pointer-events-none" />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Source</label>
            <div className="relative">
              <select
                value={filters.source}
                onChange={(e) => setFilter('source', e.target.value)}
                className="h-9 w-40 appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="">All Sources</option>
                {LEAD_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary pointer-events-none" />
            </div>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Date From</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilter('dateFrom', e.target.value)}
              className="h-9 w-40"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Date To</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilter('dateTo', e.target.value)}
              className="h-9 w-40"
            />
          </div>

          {/* Score Min */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Score Min</label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={filters.scoreMin}
              onChange={(e) => setFilter('scoreMin', e.target.value)}
              className="h-9 w-20"
            />
          </div>

          {/* Score Max */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Score Max</label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="100"
              value={filters.scoreMax}
              onChange={(e) => setFilter('scoreMax', e.target.value)}
              className="h-9 w-20"
            />
          </div>

          {/* Sort */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Sort By</label>
            <div className="flex gap-1.5">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSort(
                      e.target.value as 'name' | 'createdAt' | 'leadScore',
                      sortDirection
                    )
                  }
                  className="h-9 w-32 appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="createdAt">Date Added</option>
                  <option value="name">Name</option>
                  <option value="leadScore">Score</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary pointer-events-none" />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setSort(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')
                }
                className="h-9 w-9 px-0"
                title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
