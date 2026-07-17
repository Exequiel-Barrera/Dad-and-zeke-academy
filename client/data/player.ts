export type Player = {
  name: string
  stars: number
  leaves: number
  level: number

  completedMissions: string[]
  unlockedWorlds: string[]
  badges: string[]
}

export const player: Player = {
  name: 'Zeke',

  stars: 0,

  leaves: 0,

  level: 1,

  completedMissions: [],

  unlockedWorlds: [
    'reading',
    'writing',
  ],

  badges: [],
}