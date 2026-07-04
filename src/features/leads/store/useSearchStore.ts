import { create } from 'zustand'
import type { LeadStatus } from '@/types'

export type SortField = 'name' | 'createdAt' | 'leadScore'
export type SortDirection = 'asc' | 'desc'

interface SearchFilters {
  status: LeadStatus | 'all'
  industry: string
  source: string
  dateFrom: string
  dateTo: string
  scoreMin: string
  scoreMax: string
}

interface SearchState {
  query: string
  filters: SearchFilters
  sortBy: SortField
  sortDirection: SortDirection

  setQuery: (query: string) => void
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  clearFilters: () => void
  setSort: (field: SortField, direction: SortDirection) => void
  hasActiveFilters: () => boolean
  activeFilterCount: () => number
}

const DEFAULT_FILTERS: SearchFilters = {
  status: 'all',
  industry: '',
  source: '',
  dateFrom: '',
  dateTo: '',
  scoreMin: '',
  scoreMax: '',
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: '',
  filters: { ...DEFAULT_FILTERS },
  sortBy: 'createdAt',
  sortDirection: 'desc',

  setQuery: (query) => set({ query }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  clearFilters: () =>
    set({
      query: '',
      filters: { ...DEFAULT_FILTERS },
      sortBy: 'createdAt',
      sortDirection: 'desc',
    }),

  setSort: (sortBy, sortDirection) => set({ sortBy, sortDirection }),

  hasActiveFilters: () => {
    const { query, filters } = get()
    return (
      query !== '' ||
      filters.status !== 'all' ||
      filters.industry !== '' ||
      filters.source !== '' ||
      filters.dateFrom !== '' ||
      filters.dateTo !== '' ||
      filters.scoreMin !== '' ||
      filters.scoreMax !== ''
    )
  },

  activeFilterCount: () => {
    const { query, filters } = get()
    let count = 0
    if (query !== '') count++
    if (filters.status !== 'all') count++
    if (filters.industry !== '') count++
    if (filters.source !== '') count++
    if (filters.dateFrom !== '') count++
    if (filters.dateTo !== '') count++
    if (filters.scoreMin !== '') count++
    if (filters.scoreMax !== '') count++
    return count
  },
}))
