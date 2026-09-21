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
} from '../data/learningProfile'

import {
  player as initialPlayer,
  type Player,
} from '../data/player'

import { getReadingDifficulty } from '../utils/getReadingDifficulty'
import { getReadingLevel } from '../utils/getReadingLevel'

/*
  --------------------------------
  READING QUESTION RESULT
  --------------------------------

  This represents one question that
  was answered during a reading mission.
*/

export type ReadingQuestionResult = {
  skill: LearningSkill
  correct: boolean
}

type PlayerContextType = {
  player: Player

  learningProfile: LearningProfile

  addStars: (
    amount: number,
  ) => void

  completeMission: (
    missionId: string,
  ) => void

  recordReadingResult: (
    results: ReadingQuestionResult[],
  ) => void

  /*
    Used by the Dad Dashboard
    developer testing buttons.
  */

  simulateReadingResult: (
    results: ReadingQuestionResult[],
  ) => void

  /*
    NEW:
    Resets ONLY adaptive learning data.

    It does NOT reset:
    - stars
    - completed game missions
    - Reading Forest progress
  */

  resetLearningTestData:
    () => void

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
    Temporary session state.

    This tells the Reading Forest that
    a mission was just completed so
    Zeke can travel toward the next
    mission.

    We intentionally do NOT save this
    value in localStorage.
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
      JSON.stringify(
        learningProfile,
      ),
    )
  }, [learningProfile])

  /*
    --------------------------------
    STARS
    --------------------------------
  */

  function addStars(
    amount: number,
  ) {
    setPlayer((current) => ({
      ...current,

      stars:
        current.stars + amount,
    }))
  }

  /*
    --------------------------------
    COMPLETE GAME MISSION
    --------------------------------
  */

  function completeMission(
    missionId: string,
  ) {
    setPlayer((current) => {
      /*
        Never complete the same
        game mission twice.
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
        journey on the map.
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
    UPDATE LEARNING PROFILE
    --------------------------------

    Both REAL reading missions and
    DEVELOPER simulations use this
    function.

    That means our testing system is
    testing the same adaptive-learning
    engine used by the real game.
  */

  function updateLearningProfile(
    results: ReadingQuestionResult[],
  ) {
    if (results.length === 0) {
      return
    }

    setLearningProfile(
      (currentProfile) => {
        /*
          --------------------------------
          MISSION ACCURACY
          --------------------------------
        */

        const correctAnswers =
          results.filter(
            (result) =>
              result.correct,
          ).length

        const missionAccuracy =
          correctAnswers /
          results.length

        const previousMissionCount =
          currentProfile
            .completedReadingMissions

        /*
          Calculate cumulative average.

          Example:

          Existing:
          80% across 2 missions

          New mission:
          100%

          Result:

          (0.8 × 2 + 1) / 3
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
          UPDATE INDIVIDUAL SKILLS
          --------------------------------
        */

        const updatedSkillProgress = {
          ...currentProfile.skillProgress,
        }

        results.forEach(
          (result) => {
            const currentSkill =
              updatedSkillProgress[
                result.skill
              ]

            updatedSkillProgress[
              result.skill
            ] = {
              correct:
                currentSkill.correct +
                (result.correct
                  ? 1
                  : 0),

              total:
                currentSkill.total +
                1,
            }
          },
        )

        /*
          First create the profile
          containing the new evidence.
        */

        const updatedProfile: LearningProfile =
          {
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
          ADAPTIVE READING LEVEL
          --------------------------------

          Reading Level is calculated
          from the NEW profile data.
        */

        const newReadingLevel =
          getReadingLevel(
            updatedProfile,
          )

        /*
          Create another profile with
          the newly calculated reading
          level.

          Difficulty can then use that
          level as part of its decision.
        */

        const profileWithReadingLevel: LearningProfile =
          {
            ...updatedProfile,

            readingLevel:
              newReadingLevel,
          }

        /*
          --------------------------------
          ADAPTIVE DIFFICULTY
          --------------------------------
        */

        const newDifficulty =
          getReadingDifficulty(
            profileWithReadingLevel,
          )

        /*
          Final learning profile.
        */

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
    REAL READING RESULT
    --------------------------------

    ReadingMission.tsx uses this
    after Zeke completes a real
    reading mission.
  */

  function recordReadingResult(
    results: ReadingQuestionResult[],
  ) {
    updateLearningProfile(
      results,
    )
  }

  /*
    --------------------------------
    DEVELOPER SIMULATION
    --------------------------------

    DadDashboard.tsx uses this.

    IMPORTANT:

    This changes learning data,
    but it does NOT:

    - award stars
    - complete Reading Forest missions
    - change map progress
  */

  function simulateReadingResult(
    results: ReadingQuestionResult[],
  ) {
    updateLearningProfile(
      results,
    )
  }

  /*
    --------------------------------
    RESET LEARNING TEST DATA
    --------------------------------

    This is intentionally separate
    from player/game progress.

    It resets:

    - recorded reading missions
    - average accuracy
    - reading level
    - adaptive difficulty
    - individual skill evidence

    It DOES NOT reset:

    - player stars
    - completed game missions
    - Reading Forest progress
  */

  function resetLearningTestData() {
    /*
      Create a fresh copy rather than
      directly reusing nested objects.

      This prevents accidental sharing
      of skillProgress references.
    */

    const freshLearningProfile: LearningProfile =
      {
        ...initialLearningProfile,

        skillProgress:
          Object.fromEntries(
            Object.entries(
              initialLearningProfile
                .skillProgress,
            ).map(
              ([skill, progress]) => [
                skill,
                {
                  ...progress,
                },
              ],
            ),
          ) as LearningProfile['skillProgress'],
      }

    setLearningProfile(
      freshLearningProfile,
    )

    /*
      Also clear the stored learning
      profile immediately.

      The useEffect above will then
      save the fresh profile.
    */

    localStorage.removeItem(
      LEARNING_PROFILE_STORAGE_KEY,
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

        resetLearningTestData,

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