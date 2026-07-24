import { Link } from 'react-router'

import type { WorldThemeConfig } from './worldThemes'
import type {
  MissionNodeStatus,
  WorldMapMission,
} from './types'
import WorldCharacter from './WorldCharacter'

type MissionNodeProps = {
  mission: WorldMapMission
  status: MissionNodeStatus
  worldPath: string
  theme: WorldThemeConfig
  sceneryIcon: string
  position: 'left' | 'right'
}

function MissionNode({
  mission,
  status,
  worldPath,
  theme,
  sceneryIcon,
  position,
}: MissionNodeProps) {
  const completed = status === 'completed'
  const current = status === 'current'
  const locked = status === 'locked'

  const nodeClassName = completed
    ? theme.completedNode
    : current
      ? theme.currentNode
      : theme.lockedNode

  const positionClassName =
    position === 'left' ? 'md:mr-24' : 'md:ml-24'

  return (
    <div className={`relative ${positionClassName}`}>
      <span
        aria-hidden="true"
        className="absolute -left-3 -top-5 text-4xl"
      >
        {sceneryIcon}
      </span>

      {current && (
        <WorldCharacter
          mascot={theme.mascot}
          message="Zeke is here!"
        />
      )}

      <article
        className={`rounded-3xl border-4 p-6 shadow-md transition duration-300 md:p-8 ${
          current ? `${nodeClassName} scale-[1.02]` : nodeClassName
        }`}
      >
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
          <div
            aria-hidden="true"
            className={`text-6xl ${
              current ? 'animate-pulse' : ''
            }`}
          >
            {completed
              ? '✅'
              : current
                ? theme.mascot
                : '🔒'}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <p className="text-lg font-bold">
                Mission {mission.number}
              </p>

              {current && (
                <span
                  className={`rounded-full px-4 py-1 text-sm font-bold ${theme.badge}`}
                >
                  Current Mission
                </span>
              )}

              {completed && (
                <span className="rounded-full bg-green-700 px-4 py-1 text-sm font-bold text-white">
                  Completed
                </span>
              )}
            </div>

            <h2 className="mt-2 text-3xl font-bold">
              {mission.title}
            </h2>

            <p className="mt-3 text-xl">
              Reward: {'⭐'.repeat(mission.stars)}
            </p>

            <p className="mt-2 font-bold">
              {completed &&
                'Fantastic work! You completed this mission.'}

              {current &&
                'Your next adventure is ready!'}

              {locked &&
                'Complete the previous mission to unlock this path.'}
            </p>
          </div>

          <div>
            {!locked ? (
              <Link
                to={`/${worldPath}/mission/${mission.id}`}
                className={`inline-block rounded-2xl px-7 py-4 text-lg font-bold text-white transition hover:scale-105 ${theme.button}`}
              >
                {completed
                  ? 'Play Again'
                  : 'Continue Adventure'}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-2xl bg-gray-400 px-7 py-4 text-lg font-bold text-white"
              >
                Locked
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export default MissionNode