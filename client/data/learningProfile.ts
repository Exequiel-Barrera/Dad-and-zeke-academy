export type DifficultyLevel =
  | 'beginner'
  | 'easy'
  | 'easy-plus'
  | 'medium'

export type LearningSkill =
  | 'reading-comprehension'
  | 'vocabulary'
  | 'sequencing'
  | 'inference'
  | 'sentence-building'

export type SkillProgress = {
  correct: number
  total: number
}

export type SkillProgressMap = Record<
  LearningSkill,
  SkillProgress
>

export type LearningProfile = {
  age: number
  readingLevel: number
  averageAccuracy: number
  completedReadingMissions: number
  currentDifficulty: DifficultyLevel
  skillProgress: SkillProgressMap
}

export const initialLearningProfile: LearningProfile = {
  age: 6,
  readingLevel: 1,
  averageAccuracy: 0,
  completedReadingMissions: 0,
  currentDifficulty: 'beginner',

  skillProgress: {
    'reading-comprehension': {
      correct: 0,
      total: 0,
    },

    vocabulary: {
      correct: 0,
      total: 0,
    },

    sequencing: {
      correct: 0,
      total: 0,
    },

    inference: {
      correct: 0,
      total: 0,
    },

    'sentence-building': {
      correct: 0,
      total: 0,
    },
  },
}

export function getSkillAccuracy(
  skillProgress: SkillProgress,
) {
  if (skillProgress.total === 0) {
    return 0
  }

  return (
    skillProgress.correct /
    skillProgress.total
  )
}

export function getSkillAccuracyPercent(
  skillProgress: SkillProgress,
) {
  return Math.round(
    getSkillAccuracy(skillProgress) *
      100,
  )
}