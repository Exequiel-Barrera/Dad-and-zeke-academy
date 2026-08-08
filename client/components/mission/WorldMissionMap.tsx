import { Link } from 'react-router'

type WorldTheme = 'reading' | 'writing'

type WorldMapMission = {
  id: string
  number: number
  title: string
  stars: number
}

type WorldMissionMapProps = {
  missions: WorldMapMission[]
  completedMissions: string[]
  worldPath: string
  theme: WorldTheme
}

const themeStyles = {
  reading: {
    completedNode: 'border-green-700 bg-green-200 text-green-950',
    currentNode:
      'border-green-700 bg-white text-green-950 ring-4 ring-green-300',
    lockedNode: 'border-gray-400 bg-gray-200 text-gray-500',
    completedPath: 'bg-green-500',
    lockedPath: 'bg-gray-300',
    button: 'bg-green-700 hover:bg-green-800',
    currentBadge: 'bg-green-700 text-white',
    mascot: '🦖',
    completedIcon: '✅',
    lockedIcon: '🔒',
    scenery: ['🌳', '🍄', '🌲', '🌿', '🍃', '🌼'],
  },

  writing: {
    completedNode: 'border-purple-700 bg-purple-200 text-purple-950',
    currentNode:
      'border-purple-700 bg-white text-purple-950 ring-4 ring-purple-300',
    lockedNode: 'border-gray-400 bg-gray-200 text-gray-500',
    completedPath: 'bg-purple-500',
    lockedPath: 'bg-gray-300',
    button: 'bg-purple-700 hover:bg-purple-800',
    currentBadge: 'bg-purple-700 text-white',
    mascot: '🐼',
    completedIcon: '✅',
    lockedIcon: '🔒',
    scenery: ['✏️', '📚', '📝', '⭐', '📖', '🎨'],
  },
}

function WorldMissionMap({
  missions,
  completedMissions,
  worldPath,
  theme,
}: WorldMissionMapProps) {
  const styles = themeStyles[theme]

  const currentMissionIndex = missions.findIndex(
    (mission) => !completedMissions.includes(mission.id),
  )

  const allMissionsCompleted =
    missions.length > 0 &&
    missions.every((mission) =>
      completedMissions.includes(mission.id),
    )

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      {missions.map((mission, index) => {
        const completed = completedMissions.includes(mission.id)

        const previousMission = missions[index - 1]

        const unlocked =
          index === 0 ||
          completedMissions.includes(previousMission.id)

        const isCurrent =
          index === currentMissionIndex && unlocked && !completed

        const previousMissionCompleted =
          index === 0 ||
          completedMissions.includes(previousMission.id)

        const nodeStyles = completed
          ? styles.completedNode
          : isCurrent
            ? styles.currentNode
            : styles.lockedNode

        const sceneryIcon =
          styles.scenery[index % styles.scenery.length]

        const nodePosition =
          index % 2 === 0
            ? 'md:mr-20'
            : 'md:ml-20'

        return (
          <div key={mission.id} className="relative">
            {index > 0 && (
              <div className="relative mx-auto h-20 w-3 overflow-hidden rounded-full bg-gray-300">
                <div
                  className={`absolute inset-x-0 top-0 rounded-full transition-all duration-1000 ${
                    previousMissionCompleted
                      ? `h-full ${styles.completedPath}`
                      : `h-0 ${styles.lockedPath}`
                  }`}
                />

                {previousMissionCompleted && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce text-xl">
                    ⭐
                  </span>
                )}
              </div>
            )}

            <div className={`relative ${nodePosition}`}>
              <span className="absolute -left-3 -top-5 text-4xl">
                {sceneryIcon}
              </span>

           

              <article
                className={`rounded-3xl border-4 p-6 shadow-md transition duration-300 md:p-8 ${
                  isCurrent
                    ? `${nodeStyles} scale-[1.02]`
                    : nodeStyles
                }`}
              >
                <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
                  <div
                    className={`text-6xl ${
                      isCurrent ? 'animate-pulse' : ''
                    }`}
                  >
                    {completed
                      ? styles.completedIcon
                      : unlocked
                        ? styles.mascot
                        : styles.lockedIcon}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                      <p className="text-lg font-bold">
                        Mission {mission.number}
                      </p>

                      {isCurrent && (
                        <span
                          className={`rounded-full px-4 py-1 text-sm font-bold ${styles.currentBadge}`}
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
                      {completed
                        ? 'Fantastic work! You completed this mission.'
                        : isCurrent
                          ? 'Your next adventure is ready!'
                          : 'Complete the previous mission to unlock this path.'}
                    </p>
                  </div>

                  <div>
                    {unlocked ? (
                      <Link
                        to={`/${worldPath}/mission/${mission.id}`}
                        className={`inline-block rounded-2xl px-7 py-4 text-lg font-bold text-white transition hover:scale-105 ${styles.button}`}
                      >
                        {completed
                          ? 'Play Again'
                          : isCurrent
                            ? 'Continue Adventure'
                            : 'Start Mission'}
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
          </div>
        )
      })}

      <div className="mt-20 text-center">
        {allMissionsCompleted ? (
          <div className="rounded-3xl border-4 border-yellow-500 bg-yellow-100 p-8 shadow-lg">
            <p className="animate-bounce text-7xl">🏆</p>

            <h2 className="mt-4 text-4xl font-bold text-yellow-900">
              World Complete!
            </h2>

            <p className="mt-3 text-xl font-bold">
              Amazing work, Explorer Zeke! You completed every mission in this
              world.
            </p>
          </div>
        ) : (
          <>
            <p className="text-6xl">🏆</p>

            <p className="mt-3 text-2xl font-bold">
              Complete every mission to reach the world trophy!
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default WorldMissionMap