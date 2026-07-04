import { useState, useEffect, useRef } from 'react'
import { Plus, ChevronDown, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTagStore, type Tag } from '../store/useTagStore'
import { TagBadge } from './TagBadge'

const PRESET_COLORS = [
  '#6366F1', // indigo
  '#3B82F6', // blue
  '#22C55E', // green
  '#EAB308', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#71717A', // gray
]

interface TagManagerProps {
  leadId: string
}

export function TagManager({ leadId }: TagManagerProps) {
  const {
    tags,
    leadTags,
    fetchTags,
    createTag,
    assignTag,
    removeTag,
    fetchLeadTags,
  } = useTagStore()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  useEffect(() => {
    fetchLeadTags(leadId)
  }, [leadId, fetchLeadTags])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setCreating(false)
        setNewTagName('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const leadTagIds = new Set(leadTags.map((t) => t.id))
  const availableTags = tags.filter((t) => !leadTagIds.has(t.id))

  const handleAssign = async (tag: Tag) => {
    try {
      await assignTag(leadId, tag.id)
      await fetchLeadTags(leadId)
      setDropdownOpen(false)
    } catch (error) {
      console.error('Failed to assign tag:', error)
    }
  }

  const handleRemove = async (tagId: string) => {
    try {
      await removeTag(leadId, tagId)
    } catch (error) {
      console.error('Failed to remove tag:', error)
    }
  }

  const handleCreateAndAssign = async () => {
    if (!newTagName.trim()) return
    try {
      const tag = await createTag(newTagName.trim(), newTagColor)
      await assignTag(leadId, tag.id)
      await fetchLeadTags(leadId)
      setCreating(false)
      setNewTagName('')
      setDropdownOpen(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2">
        {leadTags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => handleRemove(tag.id)}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="h-7 text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Tag
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {dropdownOpen && (
        <div className="absolute z-50 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg">
          {!creating ? (
            <div className="p-2">
              {availableTags.length > 0 && (
                <div className="space-y-1">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleAssign(tag)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-accent/10 transition-colors"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
              {availableTags.length === 0 && (
                <p className="px-2 py-1.5 text-xs text-secondary">
                  All tags assigned
                </p>
              )}
              <div className="mt-1 border-t border-border pt-1">
                <button
                  onClick={() => setCreating(true)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-accent hover:bg-accent/10 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create new tag
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAssign()}
                className="h-8 text-sm"
                autoFocus
              />
              <div>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors"
                >
                  <Palette className="h-3.5 w-3.5" />
                  Color
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: newTagColor }}
                  />
                </button>
                {showColorPicker && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setNewTagColor(color)
                          setShowColorPicker(false)
                        }}
                        className={`h-6 w-6 rounded-full transition-transform ${
                          newTagColor === color ? 'ring-2 ring-offset-2 ring-accent scale-110' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCreating(false)
                    setNewTagName('')
                  }}
                  className="flex-1 h-8"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateAndAssign}
                  disabled={!newTagName.trim()}
                  className="flex-1 h-8"
                >
                  Create
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
