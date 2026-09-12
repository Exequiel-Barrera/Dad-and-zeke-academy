import type {
  LearningProfile,
} from '../data/learningProfile'

export function getReadingLevel(
  profile: LearningProfile,
): number {
  const {
    completedReadingMissions,
    averageAccuracy,
    skillProgress,
  } = profile

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

  const reliableSkillsAtOrAbove70 =
    reliableSkillAccuracies.filter(
      (accuracy) =>
        accuracy >= 0.7,
    ).length

  const reliableSkillsAtOrAbove80 =
    reliableSkillAccuracies.filter(
      (accuracy) =>
        accuracy >= 0.8,
    ).length

  /*
    --------------------------------
    LEVEL 1
    --------------------------------

    Stay at Level 1 while we are
    still collecting early data.
  */

  if (completedReadingMissions < 3) {
    return 1
  }

  if (averageAccuracy < 0.75) {
    return 1
  }

  /*
    --------------------------------
    LEVEL 2
    --------------------------------

    Requires:
    - at least 3 reading missions
    - 75%+ average accuracy
    - at least 1 reliable skill
      at 70%+
  */

  if (
    completedReadingMissions >= 3 &&
    averageAccuracy >= 0.75 &&
    reliableSkillsAtOrAbove70 >= 1
  ) {
    /*
      Check Level 3 before returning
      Level 2.
    */

    if (
      completedReadingMissions >= 6 &&
      averageAccuracy >= 0.9 &&
      reliableSkillsAtOrAbove80 >= 3
    ) {
      return 3
    }

    return 2
  }

  return 1
}