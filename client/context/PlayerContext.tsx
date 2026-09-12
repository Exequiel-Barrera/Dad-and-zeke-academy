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
import { getReadingLevel } from '../utils/getReadingLevel'

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

  simulateReadingResult: (
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
  --------------------------------
  LOAD LEARNING PROFILE
  --------------------------------

  This also protects us if an older
  saved profile is missing newer fields.
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
    --------------------------------
    TEMPORARY JOURNEY STATE
    --------------------------------

    This is NOT saved in localStorage.

    It tells the world map that a
    mission was just completed so
    Zeke can travel to the next mission.
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
    ADD STARS
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
        skill: 'vocabulary',
        correct: false,
      },
    ]

    This updates:

    - completed reading missions
    - overall accuracy
    - individual skill progress
    - adaptive reading level
    - adaptive difficulty
  */

  function recordReadingResult(
    results: ReadingQuestionResult[],
  ) {
    if (results.length === 0) {
      return
    }

    const correctAnswers =
      results.filter(
        (result) =>
          result.correct,
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
          COPY SKILL PROGRESS
          --------------------------------
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
          --------------------------------
          UPDATE EACH SKILL
          --------------------------------
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
          --------------------------------
          BUILD UPDATED PROFILE
          --------------------------------
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
          --------------------------------
          ADAPT READING LEVEL
          --------------------------------
        */

        const newReadingLevel =
          getReadingLevel(
            updatedProfile,
          )

        const profileWithReadingLevel:
          LearningProfile = {
          ...updatedProfile,

          readingLevel:
            newReadingLevel,
        }

        /*
          --------------------------------
          ADAPT DIFFICULTY
          --------------------------------

          Difficulty is calculated AFTER
          the new reading level so both
          systems stay connected.
        */

        const newDifficulty =
          getReadingDifficulty(
            profileWithReadingLevel,
          )

        return {
          ...profileWithReadingLevel,

          currentDifficulty:
            newDifficulty,
        }
      },
    )
  }

  /*
    --------------------------------
    SIMULATE READING RESULT
    --------------------------------

    Developer testing only.

    This sends fake question results
    through exactly the same adaptive
    learning engine as a real mission.

    It does NOT:
    - add stars
    - complete game missions
    - change Reading Forest progression
  */

  function simulateReadingResult(
    results: ReadingQuestionResult[],
  ) {
    recordReadingResult(
      results,
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

        simulateReadingResult,

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