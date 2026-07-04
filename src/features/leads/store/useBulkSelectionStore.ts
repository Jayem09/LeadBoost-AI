import { create } from 'zustand'

interface BulkSelectionStore {
  selectedIds: Set<string>
  isSelectMode: boolean
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  toggleSelectMode: () => void
  selectedCount: () => number
  isSelected: (id: string) => boolean
}

export const useBulkSelectionStore = create<BulkSelectionStore>()((set, get) => ({
  selectedIds: new Set<string>(),
  isSelectMode: false,

  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selectedIds: next }
    }),

  selectAll: (ids) =>
    set((state) => {
      // If all are already selected, deselect all
      if (ids.length > 0 && ids.every((id) => state.selectedIds.has(id))) {
        return { selectedIds: new Set<string>() }
      }
      return { selectedIds: new Set(ids) }
    }),

  clearSelection: () => set({ selectedIds: new Set<string>(), isSelectMode: false }),

  toggleSelectMode: () =>
    set((state) => ({
      isSelectMode: !state.isSelectMode,
      selectedIds: state.isSelectMode ? new Set<string>() : state.selectedIds,
    })),

  selectedCount: () => get().selectedIds.size,

  isSelected: (id) => get().selectedIds.has(id),
}))
