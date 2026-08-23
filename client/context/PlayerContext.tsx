import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  player as initialPlayer,
  Player,
} from '../data/player'

type PlayerContextType = {
  player: Player

  addStars: (amount: number) => void

  completeMission: (
    missionId: string,
  ) => void

  recentlyCompletedMissionId:
    | string
    | null

  clearRecentMission: () => void
}

const PlayerContext =
  createContext<PlayerContextType | null>(
    null,
  )

type ProviderProps = {
  children: ReactNode
}

const PLAYER_STORAGE_KEY =
  'dad-and-zeke-player'

export function PlayerProvider({
  children,
}: ProviderProps) {
  const [player, setPlayer] =
    useState<Player>(() => {
      const savedPlayer =
        localStorage.getItem(
          PLAYER_STORAGE_KEY,
        )

      if (savedPlayer) {
        try {
          return JSON.parse(
            savedPlayer,
          ) as Player
        } catch {
          console.error(
            'Could not load saved player progress',
          )
        }
      }

      return initialPlayer
    })

  /*
    This is intentionally NOT saved
    into localStorage.

    It represents something that
    happened during the current
    app session.
  */
  const [
    recentlyCompletedMissionId,
    setRecentlyCompletedMissionId,
  ] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(
      PLAYER_STORAGE_KEY,
      JSON.stringify(player),
    )
  }, [player])

  function addStars(amount: number) {
    setPlayer((current) => ({
      ...current,

      stars:
        current.stars + amount,
    }))
  }

  function completeMission(
    missionId: string,
  ) {
    setPlayer((current) => {
      /*
        Don't complete or reward
        the same mission twice.
      */
      if (
        current.completedMissions.includes(
          missionId,
        )
      ) {
        return current
      }

      /*
        Remember that this mission
        was JUST completed.

        WorldAdventureMap will use
        this to decide whether Zeke
        should travel to the next
        mission.
      */
      setRecentlyCompletedMissionId(
        missionId,
      )

      return {
        ...current,

        completedMissions: [
          ...current.completedMissions,
          missionId,
        ],
      }
    })
  }

  function clearRecentMission() {
    setRecentlyCompletedMissionId(
      null,
    )
  }

  return (
    <PlayerContext.Provider
      value={{
        player,
        addStars,
        completeMission,

        recentlyCompletedMissionId,
        clearRecentMission,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context =
    useContext(PlayerContext)

  if (!context) {
    throw new Error(
      'usePlayer must be used inside PlayerProvider',
    )
  }

  return context
}