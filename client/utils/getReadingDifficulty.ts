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
    skillProgress,
  } = profile

  /*
    --------------------------------
    NOT ENOUGH MISSION DATA YET
    --------------------------------

    Keep the learner at Beginner
    until at least 2 reading missions
    have been recorded.
  */

  if (completedReadingMissions < 2) {
    return 'beginner'
  }

  /*
    --------------------------------
    LOW OVERALL ACCURACY
    --------------------------------

    If overall accuracy is below 60%,
    stay at Beginner regardless of
    mission count.
  */

  if (averageAccuracy < 0.6) {
    return 'beginner'
  }

  /*
    --------------------------------
    EARLY SKILL EVIDENCE
    --------------------------------

    Count only skills that have at least
    4 answers recorded.

    These are considered reliable enough
    to influence difficulty decisions.
  */

  const reliableSkillAccuracies =
    Object.values(skillProgress)
      .filter(
        (progress) =>
          progress.total >= 4,
      )
      .map(
        (progress) =>
          progress.correct /
          progress.total,
      )

  /*
    --------------------------------
    STRUGGLING SKILL PROTECTION
    --------------------------------

    If any reliably measured skill is
    below 55%, don't increase difficulty
    beyond Easy.

    This allows the next missions to keep
    practising that skill without making
    the whole experience too hard.
  */

  const hasStrugglingReliableSkill =
    reliableSkillAccuracies.some(
      (accuracy) =>
        accuracy < 0.55,
    )

  if (hasStrugglingReliableSkill) {
    return 'easy'
  }

  /*
    --------------------------------
    EASY
    --------------------------------

    60%–74% overall accuracy:
    introduce gentle progression.
  */

  if (averageAccuracy < 0.75) {
    return 'easy'
  }

  /*
    --------------------------------
    EASY PLUS
    --------------------------------

    Require at least 3 recorded reading
    missions before moving to Easy+.

    This prevents one or two very strong
    results from advancing too quickly.
  */

  if (
    completedReadingMissions < 3
  ) {
    return 'easy'
  }

  if (averageAccuracy < 0.9) {
    return 'easy-plus'
  }

  /*
    --------------------------------
    MEDIUM READINESS
    --------------------------------

    Medium requires:

    - 5+ reading missions
    - 90%+ overall accuracy
    - reading level 2+
    - at least 2 reliably measured skills
    - no reliable skill below 70%

    This makes the jump to Medium much
    more deliberate.
  */

  const reliableSkillsAtOrAbove70 =
    reliableSkillAccuracies.filter(
      (accuracy) =>
        accuracy >= 0.7,
    ).length

  const allReliableSkillsAtOrAbove70 =
    reliableSkillAccuracies.length > 0 &&
    reliableSkillAccuracies.every(
      (accuracy) =>
        accuracy >= 0.7,
    )

  if (
    completedReadingMissions >= 5 &&
    averageAccuracy >= 0.9 &&
    readingLevel >= 2 &&
    reliableSkillsAtOrAbove70 >= 2 &&
    allReliableSkillsAtOrAbove70
  ) {
    return 'medium'
  }

  /*
    High overall accuracy but not enough
    evidence for Medium yet.
  */

  return 'easy-plus'
}