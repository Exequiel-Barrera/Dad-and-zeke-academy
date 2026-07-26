import ExplorerCamp from './ExplorerCamp'
import ForestDecoration from './ForestDecoration'
import type {
  MissionNodeStatus,
  WorldMapMission,
  WorldTheme,
} from './types'
import WorldSection from './WorldSection'
import { worldThemes } from './worldThemes'

type WorldAdventureMapProps = {
  missions: WorldMapMission[]
  completedMissions: string[]
  worldPath: string
  theme: WorldTheme
  stars?: number
  rexImage?: string
  dadImage?: string
  zekeImage?: string
}

function WorldAdventureMap({
  missions,
  completedMissions,
  worldPath,
  theme,
  stars = 0,
  rexImage,
  dadImage,
  zekeImage,
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

  const completedMissionCount = completedMissions.filter(
    (missionId) =>
      missions.some((mission) => mission.id === missionId),
  ).length

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

  function isLandmarkUnlocked(
    landmarkIndex: number,
  ): boolean {
    if (landmarkIndex === 0) {
      return true
    }

    const previousMission =
      missions[landmarkIndex - 1]

    if (!previousMission) {
      return allMissionsCompleted
    }

    return completedMissions.includes(
      previousMission.id,
    )
  }

  function getMissionPosition(
    index: number,
  ): 'left' | 'right' {
    return index % 2 === 0 ? 'left' : 'right'
  }

  function getOppositePosition(
    position: 'left' | 'right',
  ): 'left' | 'right' {
    return position === 'left' ? 'right' : 'left'
  }

  return (
    <div
      className={`relative mx-auto mt-12 max-w-6xl overflow-hidden rounded-[3rem] px-4 py-12 md:px-10 md:py-16 ${themeConfig.pageBackground}`}
    >
      <ForestDecoration scenery={themeConfig.scenery} />

      <div className="relative z-10">
        <ExplorerCamp
          completedCount={completedMissionCount}
          totalMissions={missions.length}
          stars={stars}
          rexImage={rexImage}
          dadImage={dadImage}
          zekeImage={zekeImage}
        />

        {missions.map((mission, index) => {
          const missionStatus = getMissionStatus(
            mission,
            index,
          )

          const missionPosition =
            getMissionPosition(index)

          const landmark =
            themeConfig.landmarks[index + 1]

          const landmarkPosition =
            getOppositePosition(missionPosition)

          const missionUnlocked =
            missionStatus !== 'locked'

          const missionCompleted =
            completedMissions.includes(mission.id)

          const sceneryIcon =
            themeConfig.scenery.length > 0
              ? themeConfig.scenery[
                  index % themeConfig.scenery.length
                ]
              : ''

          return (
            <WorldSection
              key={mission.id}
              mission={mission}
              missionStatus={missionStatus}
              missionPosition={missionPosition}
              missionCompleted={missionCompleted}
              missionUnlocked={missionUnlocked}
              worldPath={worldPath}
              theme={themeConfig}
              sceneryIcon={sceneryIcon}
              landmark={landmark}
              landmarkPosition={landmarkPosition}
              landmarkUnlocked={isLandmarkUnlocked(
                index + 1,
              )}
            />
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

            <p className="mt-4 text-xl font-bold text-yellow-950">
              Amazing work, Explorer Zeke!
            </p>

            <p className="mt-2 text-lg text-yellow-900">
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