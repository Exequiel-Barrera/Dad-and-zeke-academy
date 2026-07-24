import type { WorldTheme } from './types'

export type WorldThemeConfig = {
  pageBackground: string
  completedNode: string
  currentNode: string
  lockedNode: string
  completedPath: string
  lockedPath: string
  button: string
  badge: string
  mascot: string
  scenery: string[]
}

export const worldThemes: Record<
  WorldTheme,
  WorldThemeConfig
> = {
  reading: {
    pageBackground: 'bg-green-100',
    completedNode:
      'border-green-700 bg-green-200 text-green-950',
    currentNode:
      'border-green-700 bg-white text-green-950 ring-4 ring-green-300',
    lockedNode:
      'border-gray-400 bg-gray-200 text-gray-500',
    completedPath: 'bg-green-500',
    lockedPath: 'bg-gray-300',
    button: 'bg-green-700 hover:bg-green-800',
    badge: 'bg-green-700 text-white',
    mascot: '🦖',
    scenery: ['🌳', '🍄', '🌲', '🌿', '🍃', '🌼'],
  },

  writing: {
    pageBackground: 'bg-purple-100',
    completedNode:
      'border-purple-700 bg-purple-200 text-purple-950',
    currentNode:
      'border-purple-700 bg-white text-purple-950 ring-4 ring-purple-300',
    lockedNode:
      'border-gray-400 bg-gray-200 text-gray-500',
    completedPath: 'bg-purple-500',
    lockedPath: 'bg-gray-300',
    button: 'bg-purple-700 hover:bg-purple-800',
    badge: 'bg-purple-700 text-white',
    mascot: '🐼',
    scenery: ['✏️', '📚', '📝', '⭐', '📖', '🎨'],
  },
}