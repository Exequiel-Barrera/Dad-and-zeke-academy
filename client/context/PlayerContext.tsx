import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  initialLearningProfile,
  type LearningProfile,
} from '../data/learningProfile'
import {
  player as initialPlayer,
  type Player,
} from '../data/player'
import { getReadingDifficulty } from '../utils/getReadingDifficulty'

type PlayerContextType = {
  player: Player

  learningProfile: LearningProfile

  addStars: (amount: number) => void

  completeMission: (
    missionId: string,
  ) => void

  recordReadingResult: (
    correctAnswers: number,
    totalQuestions: number,
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

const LEARNING_PROFILE_STORAGE_KEY =
  'dad-and-zeke-learning-profile'

export function PlayerProvider({
  children,
}: ProviderProps) {
  /*
    --------------------------------
    PLAYER / GAME PROGRESS
    --------------------------------
  */

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
    --------------------------------
    LEARNING PROFILE
    --------------------------------
  */

  const [
    learningProfile,
    setLearningProfile,
  ] = useState<LearningProfile>(() => {
    const savedProfile =
      localStorage.getItem(
        LEARNING_PROFILE_STORAGE_KEY,
      )

    if (savedProfile) {
      try {
        return JSON.parse(
          savedProfile,
        ) as LearningProfile
      } catch {
        console.error(
          'Could not load saved learning profile',
        )
      }
    }

    return initialLearningProfile
  })

  /*
    This is temporary session state.

    We DON'T save this in localStorage.

    It tells the map that a mission was
    just completed so Zeke can travel
    toward the newly unlocked mission.
  */

  const [
    recentlyCompletedMissionId,
    setRecentlyCompletedMissionId,
  ] = useState<string | null>(null)

  /*
    --------------------------------
    SAVE PLAYER
    --------------------------------
  */

  useEffect(() => {
    localStorage.setItem(
      PLAYER_STORAGE_KEY,
      JSON.stringify(player),
    )
  }, [player])

  /*
    --------------------------------
    SAVE LEARNING PROFILE
    --------------------------------
  */

  useEffect(() => {
    localStorage.setItem(
      LEARNING_PROFILE_STORAGE_KEY,
      JSON.stringify(learningProfile),
    )
  }, [learningProfile])

  /*
    --------------------------------
    STARS
    --------------------------------
  */

  function addStars(amount: number) {
    setPlayer((current) => ({
      ...current,

      stars:
        current.stars + amount,
    }))
  }

  /*
    --------------------------------
    COMPLETE MISSION
    --------------------------------
  */

  function completeMission(
    missionId: string,
  ) {
    setPlayer((current) => {
      /*
        Never complete the same
        mission twice.
      */

      if (
        current.completedMissions.includes(
          missionId,
        )
      ) {
        return current
      }

      /*
        Remember which mission
        was just completed.

        This triggers Zeke's
        map journey.
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

  /*
    --------------------------------
    RECORD READING PERFORMANCE
    --------------------------------

    Example:

    3 correct answers
    4 total questions

    accuracy = 0.75
  */

  function recordReadingResult(
    correctAnswers: number,
    totalQuestions: number,
  ) {
    if (totalQuestions <= 0) {
      return
    }

    const missionAccuracy =
      correctAnswers /
      totalQuestions

    setLearningProfile(
      (currentProfile) => {
        const previousMissionCount =
          currentProfile
            .completedReadingMissions

        /*
          Calculate a cumulative
          average across completed
          reading missions.

          Example:

          Previous:
          80% average from 2 missions

          New mission:
          100%

          New average:
          (0.8 × 2 + 1) / 3
          = 0.866
        */

        const newAverageAccuracy =
          (
            currentProfile
              .averageAccuracy *
              previousMissionCount +
            missionAccuracy
          ) /
          (previousMissionCount + 1)

        const updatedProfile: LearningProfile =
          {
            ...currentProfile,

            completedReadingMissions:
              previousMissionCount + 1,

            averageAccuracy:
              newAverageAccuracy,
          }

        /*
          Let our difficulty engine
          decide the appropriate
          next level.
        */

        const newDifficulty =
          getReadingDifficulty(
            updatedProfile,
          )

        return {
          ...updatedProfile,

          currentDifficulty:
            newDifficulty,
        }
      },
    )
  }

  /*
    --------------------------------
    CLEAR JOURNEY EVENT
    --------------------------------
  */

  function clearRecentMission() {
    setRecentlyCompletedMissionId(
      null,
    )
  }

  return (
    <PlayerContext.Provider
      value={{
        player,

        learningProfile,

        addStars,

        completeMission,

        recordReadingResult,

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