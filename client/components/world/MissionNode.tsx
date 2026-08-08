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

  const wrapperPosition =
    position === 'left'
      ? 'md:mr-auto md:ml-4'
      : 'md:ml-auto md:mr-4'

  return (
    <section
      className={`relative w-full md:w-[78%] ${wrapperPosition}`}
    >
      <div
        aria-hidden="true"
        className={`absolute -top-12 text-6xl ${
          position === 'left'
            ? '-left-3 md:-left-16'
            : '-right-3 md:-right-16'
        }`}
      >
        {sceneryIcon}
      </div>

    

      <article
        className={`relative rounded-[2rem] border-4 p-6 shadow-md transition duration-300 md:p-8 ${
          current
            ? `${nodeClassName} scale-[1.02]`
            : nodeClassName
        }`}
      >
        {current && (
          <div
            aria-hidden="true"
            className="absolute -inset-3 -z-10 animate-pulse rounded-[2.5rem] bg-yellow-200/50"
          />
        )}

        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div
            aria-hidden="true"
            className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full ${
              completed
                ? 'bg-green-100'
                : current
                  ? 'bg-yellow-100'
                  : 'bg-gray-300'
            } text-6xl`}
          >
            {completed ? '✅' : current ? '🗺️' : '🔒'}
          </div>

          <div className="min-w-0 flex-1">
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

            <p className="mt-3 font-bold">
              {completed &&
                'Fantastic work! You completed this mission.'}

              {current && 'Your next adventure is ready!'}

              {locked &&
                'Complete the previous mission to unlock this path.'}
            </p>
          </div>

          <div className="shrink-0">
            {!locked ? (
              <Link
                to={`/${worldPath}/mission/${mission.id}`}
                className={`inline-block rounded-2xl px-7 py-4 text-lg font-bold text-white transition hover:scale-105 ${theme.button}`}
              >
                {completed ? 'Play Again' : 'Continue Adventure'}
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
    </section>
  )
}

export default MissionNode