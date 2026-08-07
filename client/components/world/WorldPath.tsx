import type { WorldTheme } from './types'

type WorldPathProps = {
  completed: boolean
  completedClassName: string
  direction: 'left-to-right' | 'right-to-left'
  theme: WorldTheme
}

type PathTheme = {
  shadow: string
  base: string
  centre: string
  locked: string
  decorations: string[]
  completedDecorations: string[]
}

const pathThemes: Record<WorldTheme, PathTheme> = {
  reading: {
    shadow: '#8f7b62',
    base: '#9b6b3d',
    centre: '#d2a06b',
    locked: '#d1d5db',
    decorations: ['🌿', '🪨', '🍄'],
    completedDecorations: ['✨', '⭐'],
  },

  writing: {
    shadow: '#9d8bae',
    base: '#7e57a3',
    centre: '#b99ad3',
    locked: '#d1d5db',
    decorations: ['✏️', '📖', '🪶'],
    completedDecorations: ['✨', '💜'],
  },

  maths: {
    shadow: '#8b93a1',
    base: '#5f6f82',
    centre: '#96a4b5',
    locked: '#d1d5db',
    decorations: ['🔢', '⚙️', '💎'],
    completedDecorations: ['✨', '⭐'],
  },

  discovery: {
    shadow: '#65866d',
    base: '#3f7d58',
    centre: '#7fba8d',
    locked: '#d1d5db',
    decorations: ['🌺', '🦋', '🍃'],
    completedDecorations: ['✨', '🔬'],
  },
}

function WorldPath({
  completed,
  completedClassName,
  direction,
  theme,
}: WorldPathProps) {
  const path =
    direction === 'left-to-right'
      ? 'M 80 10 C 160 10, 150 120, 280 120 C 390 120, 390 210, 500 210'
      : 'M 500 10 C 390 10, 400 120, 280 120 C 150 120, 160 210, 80 210'

  const themeConfig = pathThemes[theme]

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-56 w-full max-w-3xl"
    >
      <svg
        viewBox="0 0 580 220"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={path}
          fill="none"
          stroke={themeConfig.shadow}
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.3"
        />

        <path
          d={path}
          fill="none"
          stroke={themeConfig.base}
          strokeWidth="20"
          strokeLinecap="round"
        />

        <path
          d={path}
          fill="none"
          stroke={themeConfig.centre}
          strokeWidth="10"
          strokeLinecap="round"
        />

        {!completed && (
          <path
            d={path}
            fill="none"
            stroke={themeConfig.locked}
            strokeWidth="21"
            strokeLinecap="round"
            opacity="0.85"
          />
        )}

        {completed && (
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 28"
            className={`${completedClassName} transition-all duration-1000`}
          />
        )}
      </svg>

      <PathDecoration
        value={themeConfig.decorations[0]}
        className="left-[13%] top-[20%]"
      />

      <PathDecoration
        value={themeConfig.decorations[1]}
        className="left-[46%] top-[48%]"
      />

      <PathDecoration
        value={themeConfig.decorations[2]}
        className="right-[12%] top-[67%]"
      />

      {completed && (
        <>
          <PathDecoration
            value={themeConfig.completedDecorations[0]}
            className="left-[29%] top-[37%] animate-pulse"
          />

          <PathDecoration
            value={themeConfig.completedDecorations[1]}
            className="right-[29%] top-[64%] animate-pulse"
          />
        </>
      )}
    </div>
  )
}

type PathDecorationProps = {
  value: string
  className: string
}

function PathDecoration({
  value,
  className,
}: PathDecorationProps) {
  return (
    <span
      className={`pointer-events-none absolute text-2xl drop-shadow-sm ${className}`}
    >
      {value}
    </span>
  )
}

export default WorldPath