import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import { player as initialPlayer, Player } from '../data/player'

type PlayerContextType = {
  player: Player
  addStars: (amount: number) => void
  completeMission:(missionId:string)=> void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

type ProviderProps = {
  children: ReactNode
}

const PLAYER_STORAGE_KEY = 'dad-and-zeke-player'

export function PlayerProvider({ children }: ProviderProps) {
  const [player, setPlayer] = useState<Player>(() => {
    const savedPlayer = localStorage.getItem(PLAYER_STORAGE_KEY)

    if (savedPlayer) {
      try {
        return JSON.parse(savedPlayer) as Player
      } catch {
        console.error('Could not load saved player progress')
      }
    }

    return initialPlayer
  })

  useEffect(() => {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player))
  }, [player])

  function addStars(amount: number) {
    setPlayer((current) => ({
      ...current,
      stars: current.stars + amount,
    }))
  }
function completeMission(missionId: string) {
  setPlayer((current) => {
    if (current.completedMissions.includes(missionId)) {
      return current
    }

    return {
      ...current,
      completedMissions: [...current.completedMissions, missionId],
    }
  })
}
  return (
    <PlayerContext.Provider
      value={{
        player,
        addStars,
        completeMission,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)

  if (!context) {
    throw new Error('usePlayer must be used inside PlayerProvider')
  }

  return context
}