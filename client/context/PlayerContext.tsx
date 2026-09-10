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
  type LearningSkill,
  type SkillProgressMap,
} from '../data/learningProfile'
import {
  player as initialPlayer,
  type Player,
} from '../data/player'
import { getReadingDifficulty } from '../utils/getReadingDifficulty'

export type ReadingQuestionResult = {
  skill: LearningSkill
  correct: boolean
}

type PlayerContextType = {
  player: Player

  learningProfile: LearningProfile

  addStars: (amount: number) => void

  completeMission: (
    missionId: string,
  ) => void

  recordReadingResult: (
    results: ReadingQuestionResult[],
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

/*
  This makes saved learning profiles
  safe if we add new fields later.

  Any missing properties are filled
  from initialLearningProfile.
*/
function loadLearningProfile():
  LearningProfile {
  const savedProfile =
    localStorage.getItem(
      LEARNING_PROFILE_STORAGE_KEY,
    )

  if (!savedProfile) {
    return initialLearningProfile
  }

  try {
    const parsed =
      JSON.parse(savedProfile) as
        Partial<LearningProfile>

    return {
      ...initialLearningProfile,
      ...parsed,

      skillProgress: {
        ...initialLearningProfile.skillProgress,
        ...(parsed.skillProgress ?? {}),
      },
    }
  } catch {
    console.error(
      'Could not load saved learning profile',
    )

    return initialLearningProfile
  }
}

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
  ] = useState<LearningProfile>(
    loadLearningProfile,
  )

  /*
    Temporary session state.

    This is NOT stored in localStorage.

    It tells the world map that a mission
    was just completed so Zeke can travel
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
        Don't complete the same
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
        Remember which mission was
        just completed.

        WorldAdventureMap uses this
        to trigger Zeke's journey.
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

    Example input:

    [
      {
        skill: 'reading-comprehension',
        correct: true,
      },
      {
        skill: 'sequencing',
        correct: false,
      },
      {
        skill: 'inference',
        correct: true,
      },
    ]
  */

  function recordReadingResult(
    results: ReadingQuestionResult[],
  ) {
    if (results.length === 0) {
      return
    }

    const correctAnswers =
      results.filter(
        (result) => result.correct,
      ).length

    const missionAccuracy =
      correctAnswers /
      results.length

    setLearningProfile(
      (currentProfile) => {
        const previousMissionCount =
          currentProfile
            .completedReadingMissions

        /*
          --------------------------------
          OVERALL ACCURACY
          --------------------------------
        */

        const newAverageAccuracy =
          (
            currentProfile
              .averageAccuracy *
              previousMissionCount +
            missionAccuracy
          ) /
          (previousMissionCount + 1)

        /*
          --------------------------------
          SKILL PROGRESS
          --------------------------------

          Start with a copy of the
          existing values.
        */

        const updatedSkillProgress:
          SkillProgressMap = {
          'reading-comprehension': {
            ...currentProfile
              .skillProgress[
              'reading-comprehension'
            ],
          },

          vocabulary: {
            ...currentProfile
              .skillProgress.vocabulary,
          },

          sequencing: {
            ...currentProfile
              .skillProgress.sequencing,
          },

          inference: {
            ...currentProfile
              .skillProgress.inference,
          },

          'sentence-building': {
            ...currentProfile
              .skillProgress[
              'sentence-building'
            ],
          },
        }

        /*
          Record every individual
          question result against
          the skill it tested.
        */

        results.forEach((result) => {
          const currentSkill =
            updatedSkillProgress[
              result.skill
            ]

          currentSkill.total += 1

          if (result.correct) {
            currentSkill.correct += 1
          }
        })

        /*
          Build the updated profile
          before calculating the new
          difficulty.
        */

        const updatedProfile:
          LearningProfile = {
          ...currentProfile,

          completedReadingMissions:
            previousMissionCount + 1,

          averageAccuracy:
            newAverageAccuracy,

          skillProgress:
            updatedSkillProgress,
        }

        /*
          Let the adaptive difficulty
          engine decide the next
          reading level.
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