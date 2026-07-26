import MissionNode from './MissionNode'
import type {
  MissionNodeStatus,
  WorldMapMission,
} from './types'
import type { WorldThemeConfig } from './worldThemes'
import WorldLandmark from './WorldLandmark'
import WorldPath from './WorldPath'

type MapPosition = 'left' | 'right'

type WorldSectionProps = {
  mission: WorldMapMission
  missionStatus: MissionNodeStatus
  missionPosition: MapPosition
  missionCompleted: boolean
  missionUnlocked: boolean
  worldPath: string
  theme: WorldThemeConfig
  sceneryIcon: string
  landmark?: {
    icon: string
    title: string
    description: string
  }
  landmarkPosition: MapPosition
  landmarkUnlocked: boolean
}

function WorldSection({
  mission,
  missionStatus,
  missionPosition,
  missionCompleted,
  missionUnlocked,
  worldPath,
  theme,
  sceneryIcon,
  landmark,
  landmarkPosition,
  landmarkUnlocked,
}: WorldSectionProps) {
  function getPathDirection(
    destinationPosition: MapPosition,
  ): 'left-to-right' | 'right-to-left' {
    return destinationPosition === 'right'
      ? 'left-to-right'
      : 'right-to-left'
  }

  return (
    <section className="relative py-4">
      <WorldPath
        completed={missionUnlocked}
        completedClassName={theme.completedPath}
        direction={getPathDirection(missionPosition)}
      />

      <MissionNode
        mission={mission}
        status={missionStatus}
        worldPath={worldPath}
        theme={theme}
        sceneryIcon={sceneryIcon}
        position={missionPosition}
      />

      {landmark && (
        <>
          <WorldPath
            completed={missionCompleted}
            completedClassName={theme.completedPath}
            direction={getPathDirection(landmarkPosition)}
          />

          <WorldLandmark
            icon={landmark.icon}
            title={landmark.title}
            description={landmark.description}
            position={landmarkPosition}
            locked={!landmarkUnlocked}
          />
        </>
      )}
    </section>
  )
}

export default WorldSection