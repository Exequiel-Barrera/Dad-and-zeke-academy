import ForestDecoration from './ForestDecoration'
import MissionNode from './MissionNode'
import type {
  MissionNodeStatus,
  WorldMapMission,
  WorldTheme,
} from './types'
import WorldLandmark from './WorldLandmark'
import WorldPath from './WorldPath'
import { worldThemes } from './worldThemes'

type WorldAdventureMapProps = {
  missions: WorldMapMission[]
  completedMissions: string[]
  worldPath: string
  theme: WorldTheme
}

function WorldAdventureMap({
  missions,
  completedMissions,
  worldPath,
  theme,
}: WorldAdventureMapProps) {
  const themeConfig = worldThemes[theme]

  const currentMissionIndex = missions.findIndex(
    (mission) => !completedMissions.includes(mission.id),
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
    if (completedMissions.includes(mission.id)) {
      return 'completed'
    }

    if (index === currentMissionIndex) {
      return 'current'
    }

    return 'locked'
  }

  function isLandmarkUnlocked(landmarkIndex: number) {
    if (landmarkIndex === 0) {
      return true
    }

    const previousMission = missions[landmarkIndex - 1]

    if (!previousMission) {
      return allMissionsCompleted
    }

    return completedMissions.includes(previousMission.id)
  }

  function getPosition(index: number): 'left' | 'right' {
    return index % 2 === 0 ? 'left' : 'right'
  }

  function getOppositePosition(
    position: 'left' | 'right',
  ): 'left' | 'right' {
    return position === 'left' ? 'right' : 'left'
  }

  function getPathDirection(
    destinationPosition: 'left' | 'right',
  ): 'left-to-right' | 'right-to-left' {
    return destinationPosition === 'right'
      ? 'left-to-right'
      : 'right-to-left'
  }

  const startingLandmark = themeConfig.landmarks[0]

  return (
    <div className="relative mx-auto mt-12 max-w-6xl overflow-hidden rounded-[3rem] px-4 py-12 md:px-10 md:py-16">
      <ForestDecoration scenery={themeConfig.scenery} />

      <div className="relative z-10">
        {startingLandmark && (
          <div className="mb-8">
            <WorldLandmark
              icon={startingLandmark.icon}
              title={startingLandmark.title}
              description={startingLandmark.description}
              position="center"
            />
          </div>
        )}

        {missions.map((mission, index) => {
          const status = getMissionStatus(mission, index)
          const missionPosition = getPosition(index)

          const landmark =
            themeConfig.landmarks[index + 1]

          const landmarkPosition =
            getOppositePosition(missionPosition)

          const missionUnlocked = status !== 'locked'

          const missionCompleted =
            completedMissions.includes(mission.id)

          const sceneryIcon =
            themeConfig.scenery[
              index % themeConfig.scenery.length
            ]

          return (
            <section
              key={mission.id}
              className="relative"
            >
              <WorldPath
                completed={missionUnlocked}
                completedClassName={
                  themeConfig.completedPath
                }
                direction={getPathDirection(
                  missionPosition,
                )}
              />

              <MissionNode
                mission={mission}
                status={status}
                worldPath={worldPath}
                theme={themeConfig}
                sceneryIcon={sceneryIcon}
                position={missionPosition}
              />

              {landmark && (
                <>
                  <WorldPath
                    completed={missionCompleted}
                    completedClassName={
                      themeConfig.completedPath
                    }
                    direction={getPathDirection(
                      landmarkPosition,
                    )}
                  />

                  <WorldLandmark
                    icon={landmark.icon}
                    title={landmark.title}
                    description={landmark.description}
                    position={landmarkPosition}
                    locked={
                      !isLandmarkUnlocked(index + 1)
                    }
                  />
                </>
              )}
            </section>
          )
        })}

        {allMissionsCompleted && (
          <div className="mx-auto mt-16 max-w-xl rounded-[2.5rem] border-4 border-yellow-500 bg-yellow-100 p-8 text-center shadow-lg md:p-10">
            <p
              aria-hidden="true"
              className="animate-bounce text-7xl"
            >
              🏆
            </p>

            <h2 className="mt-4 text-4xl font-bold text-yellow-900">
              World Complete!
            </h2>

            <p className="mt-4 text-xl font-bold">
              Amazing work, Explorer Zeke!
            </p>

            <p className="mt-2 text-lg">
              You completed every adventure in this
              world.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorldAdventureMap