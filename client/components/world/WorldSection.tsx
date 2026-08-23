import MissionNode from './MissionNode'
import type {
  MissionNodeStatus,
  WorldMapMission,
  WorldTheme,
} from './types'
import type { WorldThemeConfig } from './worldThemes'
import WorldPath from './WorldPath'

type MapPosition = 'left' | 'right'

type WorldSectionProps = {
  mission: WorldMapMission
  missionStatus: MissionNodeStatus
  missionPosition: MapPosition
  missionUnlocked: boolean
  worldPath: string
  worldTheme: WorldTheme
  theme: WorldThemeConfig
  sceneryIcon: string

  showTrailGuide?: boolean
  trailGuideImage?: string
  trailGuideMessage?: string

  animateTrailGuide?: boolean
  onTrailJourneyComplete?: () => void
}

function WorldSection({
  mission,
  missionStatus,
  missionPosition,
  missionUnlocked,
  worldPath,
  worldTheme,
  theme,
  sceneryIcon,

  showTrailGuide = false,
  trailGuideImage,
  trailGuideMessage =
    'This is our next adventure!',

  animateTrailGuide = false,
  onTrailJourneyComplete,
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
        completedClassName={
          theme.completedPath
        }
        direction={getPathDirection(
          missionPosition,
        )}
        theme={worldTheme}
        showTrailGuide={showTrailGuide}
        trailGuideImage={
          trailGuideImage
        }
        trailGuideMessage={
          trailGuideMessage
        }
        animateTrailGuide={
          animateTrailGuide
        }
        onTrailJourneyComplete={
          onTrailJourneyComplete
        }
      />

      <MissionNode
        mission={mission}
        status={missionStatus}
        worldPath={worldPath}
        theme={theme}
        sceneryIcon={sceneryIcon}
        position={missionPosition}
      />
    </section>
  )
}

export default WorldSection