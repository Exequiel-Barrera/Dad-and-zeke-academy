import type {
  DifficultyLevel,
  LearningProfile,
} from '../data/learningProfile'

export function getReadingDifficulty(
  profile: LearningProfile,
): DifficultyLevel {
  const {
    averageAccuracy,
    completedReadingMissions,
    readingLevel,
  } = profile

  if (completedReadingMissions < 2) {
    return 'beginner'
  }

  if (
    averageAccuracy < 0.6
  ) {
    return 'beginner'
  }

  if (
    averageAccuracy < 0.75
  ) {
    return 'easy'
  }

  if (
    averageAccuracy >= 0.75 &&
    averageAccuracy < 0.9
  ) {
    return 'easy-plus'
  }

  if (
    averageAccuracy >= 0.9 &&
    completedReadingMissions >= 5 &&
    readingLevel >= 2
  ) {
    return 'medium'
  }

  return 'easy-plus'
}