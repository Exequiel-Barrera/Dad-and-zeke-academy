import type {
  LearningProfile,
  LearningSkill,
} from '../data/learningProfile'

export type SkillAssessment = {
  skill: LearningSkill
  correct: number
  total: number
  accuracy: number | null
}

export function getSkillsAssessment(
  profile: LearningProfile,
): SkillAssessment[] {
  return (
    Object.entries(
      profile.skillProgress,
    ) as [
      LearningSkill,
      {
        correct: number
        total: number
      },
    ][]
  ).map(
    ([skill, progress]) => {
      const accuracy =
        progress.total === 0
          ? null
          : progress.correct /
            progress.total

      return {
        skill,
        correct: progress.correct,
        total: progress.total,
        accuracy,
      }
    },
  )
}