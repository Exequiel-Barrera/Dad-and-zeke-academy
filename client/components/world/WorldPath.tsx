import {
  useEffect,
  useRef,
  useState,
} from 'react'

import type { WorldTheme } from './types'

type WorldPathProps = {
  completed: boolean
  completedClassName: string
  direction: 'left-to-right' | 'right-to-left'
  theme: WorldTheme

  showTrailGuide?: boolean
  trailGuideImage?: string
  trailGuideMessage?: string
}

type PathTheme = {
  shadow: string
  base: string
  centre: string
  locked: string
  decorations: string[]
  completedDecorations: string[]
}

type GuidePosition = {
  x: number
  y: number
}

const TARGET_GUIDE_PROGRESS = 0.72
const GUIDE_ANIMATION_DURATION = 1800

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
  showTrailGuide = false,
  trailGuideImage,
  trailGuideMessage = "Let's explore the next adventure!",
}: WorldPathProps) {
  const path =
    direction === 'left-to-right'
      ? 'M 80 10 C 160 10, 150 120, 280 120 C 390 120, 390 210, 500 210'
      : 'M 500 10 C 390 10, 400 120, 280 120 C 150 120, 160 210, 80 210'

  const themeConfig = pathThemes[theme]

  const pathRef =
    useRef<SVGPathElement | null>(null)

  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const animationFrameRef =
    useRef<number | null>(null)

  const [guidePosition, setGuidePosition] =
    useState<GuidePosition>({
      x: 290,
      y: 110,
    })

  const [guideProgress, setGuideProgress] =
    useState(0)

  const [guideReady, setGuideReady] =
    useState(false)

  const [isGuideMoving, setIsGuideMoving] =
    useState(false)

  useEffect(() => {
    const pathElement = pathRef.current
    const containerElement = containerRef.current

    if (
      !pathElement ||
      !containerElement ||
      !showTrailGuide
    ) {
      return
    }

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    const totalLength =
      pathElement.getTotalLength()

    function updateGuidePosition(
      progress: number,
    ) {
      const point =
        pathElement.getPointAtLength(
          totalLength * progress,
        )

      setGuideProgress(progress)

      setGuidePosition({
        x: point.x,
        y: point.y,
      })

      setGuideReady(true)
    }

    // Respect the user's reduced-motion setting.
    if (prefersReducedMotion) {
      updateGuidePosition(
        TARGET_GUIDE_PROGRESS,
      )

      setIsGuideMoving(false)

      return
    }

    let hasAnimated = false

    function startAnimation() {
      if (hasAnimated) {
        return
      }

      hasAnimated = true

      setGuideReady(false)
      setGuideProgress(0)
      setIsGuideMoving(true)

      const startTime = performance.now()

      function animateGuide(
        currentTime: number,
      ) {
        const elapsed =
          currentTime - startTime

        const animationProgress =
          Math.min(
            elapsed /
              GUIDE_ANIMATION_DURATION,
            1,
          )

        // Makes Zeke slow down naturally
        // as he reaches his destination.
        const easedProgress =
          1 -
          Math.pow(
            1 - animationProgress,
            3,
          )

        const pathProgress =
          TARGET_GUIDE_PROGRESS *
          easedProgress

        updateGuidePosition(pathProgress)

        if (animationProgress < 1) {
          animationFrameRef.current =
            requestAnimationFrame(
              animateGuide,
            )
        } else {
          setIsGuideMoving(false)
        }
      }

      animationFrameRef.current =
        requestAnimationFrame(
          animateGuide,
        )
    }

    // Wait until this part of the adventure
    // map is actually visible before Zeke moves.
    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startAnimation()
            observer.disconnect()
          }
        },
        {
          threshold: 0.35,
        },
      )

    observer.observe(containerElement)

    return () => {
      observer.disconnect()

      if (
        animationFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current,
        )
      }
    }
  }, [path, showTrailGuide])

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-72 w-full max-w-3xl"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 580 220"
        className="absolute inset-0 h-56 w-full overflow-visible"
      >
        {/* Invisible path used to calculate
            Zeke's position */}

        <path
          ref={pathRef}
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth="1"
        />

        {/* Trail shadow */}

        <path
          d={path}
          fill="none"
          stroke={themeConfig.shadow}
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Main trail */}

        <path
          d={path}
          fill="none"
          stroke={themeConfig.base}
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Trail centre */}

        <path
          d={path}
          fill="none"
          stroke={themeConfig.centre}
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Locked trail */}

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

        {/* Completed footsteps */}

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

      {/* Trail decorations */}

      <PathDecoration
        value={themeConfig.decorations[0]}
        className="left-[13%] top-[15%]"
      />

      <PathDecoration
        value={themeConfig.decorations[1]}
        className="left-[46%] top-[38%]"
      />

      <PathDecoration
        value={themeConfig.decorations[2]}
        className="right-[12%] top-[55%]"
      />

      {/* Completed-trail decorations */}

      {completed && (
        <>
          <PathDecoration
            value={
              themeConfig
                .completedDecorations[0]
            }
            className="left-[29%] top-[30%] animate-pulse"
          />

          <PathDecoration
            value={
              themeConfig
                .completedDecorations[1]
            }
            className="right-[29%] top-[51%] animate-pulse"
          />
        </>
      )}

      {/* Explorer Zeke */}

      {showTrailGuide &&
        trailGuideImage &&
        guideReady && (
          <div
            className="pointer-events-none absolute z-30"
            style={{
              left: `${
                (guidePosition.x / 580) * 100
              }%`,

              top: `${
                (guidePosition.y / 220) * 224
              }px`,

              transform:
                'translate(-50%, -50%)',
            }}
          >
            <div className="flex flex-col items-center">

              {/* Speech bubble */}

              <div className="relative mb-3 w-56 rounded-2xl border-2 border-yellow-400 bg-white px-4 py-3 text-center shadow-lg">
                <p className="text-sm font-bold text-green-950 md:text-base">
                  {isGuideMoving
                    ? 'Off we go! Follow the trail!'
                    : trailGuideMessage}
                </p>

                <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-yellow-400 bg-white" />
              </div>

              {/* Zeke portrait */}

              <div className="relative">
                <div
                  className={`absolute inset-0 scale-110 rounded-full bg-yellow-300 opacity-40 blur-md ${
                    isGuideMoving
                      ? 'animate-pulse'
                      : ''
                  }`}
                />

                <img
                  src={trailGuideImage}
                  alt="Explorer Zeke"
                  className="relative h-24 w-24 rounded-full border-4 border-yellow-400 bg-white object-cover shadow-xl md:h-28 md:w-28"
                />

                {/* Location badge */}

                {!isGuideMoving && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white shadow">
                    You are here!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Screen-reader progress information */}

      {showTrailGuide && (
        <span className="sr-only">
          Trail progress:{' '}
          {Math.round(
            guideProgress * 100,
          )}
          %
        </span>
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
      aria-hidden="true"
      className={`pointer-events-none absolute text-2xl drop-shadow-sm ${className}`}
    >
      {value}
    </span>
  )
}

export default WorldPath