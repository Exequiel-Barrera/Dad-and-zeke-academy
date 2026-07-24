import ForestDecoration from './ForestDecoration'
import MissionNode from './MissionNode'
import type {
  MissionNodeStatus,
  WorldMapMission,
  WorldTheme,
} from './types'
import WorldPath from './WorldPath'
import { worldThemes } from './worldThemes'

type WorldMissionMapProps = {
  missions: WorldMapMission[]
  completedMissions: string[]
  worldPath: string
  theme: WorldTheme
}

function WorldMissionMap({
  missions,
  completedMissions,
  worldPath,
  theme,
}: WorldMissionMapProps) {
  const themeConfig = worldThemes[theme]

  const currentMissionIndex = missions.findIndex(
    (mission) =>
      !completedMissions.includes(mission.id),
  )

  const allMissionsCompleted =
    missions.length > 0 &&
    missions.every((mission) =>
      completedMissions.includes(mission.id),
    )

  function getMissionStatus(
    mission: WorldMapMission,
    index: number,
  ): MissionNodeStatus {
    const completed = completedMissions.includes(mission.id)

    if (completed) {
      return 'completed'
    }

    if (index === currentMissionIndex) {
      return 'current'
    }

    return 'locked'
  }

  return (
    <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2.5rem] p-4 md:p-10">
      <ForestDecoration scenery={themeConfig.scenery} />

      <div className="relative z-10">
        {missions.map((mission, index) => {
          const status = getMissionStatus(mission, index)

          const previousMission = missions[index - 1]

          const previousMissionCompleted =
            index === 0 ||
            completedMissions.includes(previousMission.id)

          const sceneryIcon =
            themeConfig.scenery[
              index % themeConfig.scenery.length
            ]

          const position =
            index % 2 === 0 ? 'left' : 'right'

          return (
            <div key={mission.id}>
              {index > 0 && (
                <WorldPath
                  completed={previousMissionCompleted}
                  completedClassName={
                    themeConfig.completedPath
                  }
                  lockedClassName={themeConfig.lockedPath}
                />
              )}

              <MissionNode
                mission={mission}
                status={status}
                worldPath={worldPath}
                theme={themeConfig}
                sceneryIcon={sceneryIcon}
                position={position}
              />
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
                Amazing work, Explorer Zeke! You completed
                every mission in this world.
              </p>
            </div>
          ) : (
            <>
              <p className="text-6xl">🏆</p>

              <p className="mt-3 text-2xl font-bold">
                Complete every mission to reach the world
                trophy!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorldMissionMap