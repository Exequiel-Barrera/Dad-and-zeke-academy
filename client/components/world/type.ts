export type WorldTheme = 'reading' | 'writing'

export type WorldMapMission = {
  id: string
  number: number
  title: string
  stars: number
}

export type MissionNodeStatus =
  | 'completed'
  | 'current'
  | 'locked'