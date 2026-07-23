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
    path: 'bg-green-300',
    completedNode: 'border-green-700 bg-green-200 text-green-950',
    availableNode: 'border-green-700 bg-white text-green-950',
    lockedNode: 'border-gray-400 bg-gray-200 text-gray-500',
    button: 'bg-green-700 hover:bg-green-800',
    icon: '🦖',
    scenery: ['🌳', '🌲', '🍃', '🌿'],
  },

  writing: {
    path: 'bg-purple-300',
    completedNode: 'border-purple-700 bg-purple-200 text-purple-950',
    availableNode: 'border-purple-700 bg-white text-purple-950',
    lockedNode: 'border-gray-400 bg-gray-200 text-gray-500',
    button: 'bg-purple-700 hover:bg-purple-800',
    icon: '🐼',
    scenery: ['✏️', '📚', '📝', '⭐'],
  },
}

function WorldMissionMap({
  missions,
  completedMissions,
  worldPath,
  theme,
}: WorldMissionMapProps) {
  const styles = themeStyles[theme]

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      {missions.map((mission, index) => {
        const completed = completedMissions.includes(mission.id)

        const previousMission = missions[index - 1]

        const unlocked =
          index === 0 ||
          completedMissions.includes(previousMission.id)

        const nodeStyles = completed
          ? styles.completedNode
          : unlocked
            ? styles.availableNode
            : styles.lockedNode

        const sceneryIcon =
          styles.scenery[index % styles.scenery.length]

        return (
          <div key={mission.id} className="relative">
            {index > 0 && (
              <div
                className={`mx-auto h-16 w-2 rounded-full ${styles.path}`}
              />
            )}

            <div
              className={`relative rounded-3xl border-4 p-6 shadow-md md:p-8 ${nodeStyles}`}
            >
              <span className="absolute -left-4 -top-5 text-4xl">
                {sceneryIcon}
              </span>

              <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
                <div className="text-6xl">
                  {completed ? '✅' : unlocked ? styles.icon : '🔒'}
                </div>

                <div className="flex-1">
                  <p className="text-lg font-bold">
                    Mission {mission.number}
                  </p>

                  <h2 className="mt-1 text-3xl font-bold">
                    {mission.title}
                  </h2>

                  <p className="mt-3 text-xl">
                    Reward: {'⭐'.repeat(mission.stars)}
                  </p>

                  <p className="mt-2 font-bold">
                    {completed
                      ? 'Mission completed!'
                      : unlocked
                        ? 'Ready to begin'
                        : 'Complete the previous mission to unlock'}
                  </p>
                </div>

                <div>
                  {unlocked ? (
                    <Link
                      to={`/${worldPath}/mission/${mission.id}`}
                      className={`inline-block rounded-2xl px-7 py-4 text-lg font-bold text-white ${styles.button}`}
                    >
                      {completed ? 'Play Again' : 'Start Mission'}
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
            </div>
          </div>
        )
      })}

      <div className="mt-16 text-center">
        <p className="text-6xl">🏆</p>

        <p className="mt-3 text-2xl font-bold">
          More adventures coming soon!
        </p>
      </div>
    </div>
  )
}

export default WorldMissionMap