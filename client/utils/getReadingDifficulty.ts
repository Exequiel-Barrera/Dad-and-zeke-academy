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
  */

  if (completedReadingMissions < 2) {
    return 'beginner'
  }

  /*
    --------------------------------
    LOW OVERALL ACCURACY
    --------------------------------
  */

  if (averageAccuracy < 0.6) {
    return 'beginner'
  }

  /*
    --------------------------------
    RELIABLE SKILL EVIDENCE
    --------------------------------

    A skill needs at least 4 recorded
    answers before it influences the
    difficulty system.
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
  */

  if (averageAccuracy < 0.75) {
    return 'easy'
  }

  /*
    --------------------------------
    EASY PLUS
    --------------------------------
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

/*
  ========================================
  DIFFICULTY EXPLANATION
  ========================================

  This is used by Dad Dashboard.

  It explains WHY the adaptive system
  selected the current difficulty.
*/

export type DifficultyExplanation = {
  title: string
  message: string
}

export function getDifficultyExplanation(
  profile: LearningProfile,
): DifficultyExplanation {
  const {
    averageAccuracy,
    completedReadingMissions,
    readingLevel,
    skillProgress,
  } = profile

  /*
    --------------------------------
    STILL COLLECTING DATA
    --------------------------------
  */

  if (completedReadingMissions < 2) {
    return {
      title:
        'Still collecting early data',
      message:
        'The app keeps the difficulty at Beginner until at least 2 reading missions have been recorded.',
    }
  }

  /*
    --------------------------------
    LOW OVERALL ACCURACY
    --------------------------------
  */

  if (averageAccuracy < 0.6) {
    return {
      title:
        'Building confidence first',
      message:
        `Zeke's current average accuracy is ${Math.round(
          averageAccuracy * 100,
        )}%. The app is keeping the reading difficulty at Beginner so he can practise the current skills before moving up.`,
    }
  }

  /*
    --------------------------------
    CHECK RELIABLE SKILLS
    --------------------------------
  */

  const reliableSkills =
    Object.values(skillProgress).filter(
      (progress) =>
        progress.total >= 4,
    )

  const hasStrugglingReliableSkill =
    reliableSkills.some(
      (progress) =>
        progress.correct /
          progress.total <
        0.55,
    )

  if (hasStrugglingReliableSkill) {
    return {
      title:
        'Strengthening a skill before moving up',
      message:
        'At least one reading skill with enough recorded answers is below 55% accuracy. The app is keeping the difficulty at Easy while future missions give that skill more practice.',
    }
  }

  /*
    --------------------------------
    EASY
    --------------------------------
  */

  if (averageAccuracy < 0.75) {
    return {
      title:
        'Ready for gentle progression',
      message:
        `Zeke's current average accuracy is ${Math.round(
          averageAccuracy * 100,
        )}%. The app can introduce Easy missions while continuing to strengthen his reading skills.`,
    }
  }

  /*
    --------------------------------
    NOT ENOUGH MISSIONS FOR EASY+
    --------------------------------
  */

  if (
    completedReadingMissions < 3
  ) {
    return {
      title:
        'Doing well — gathering more evidence',
      message:
        'The results are strong, but the app waits for at least 3 recorded reading missions before moving to Easy Plus.',
    }
  }

  /*
    --------------------------------
    EASY PLUS
    --------------------------------
  */

  if (averageAccuracy < 0.9) {
    return {
      title:
        'Ready for a little more challenge',
      message:
        `Zeke's current average accuracy is ${Math.round(
          averageAccuracy * 100,
        )}%. Easy Plus can introduce more sequencing and simple inference while keeping the reading manageable.`,
    }
  }

  /*
    --------------------------------
    CHECK MEDIUM REQUIREMENTS
    --------------------------------
  */

  const reliableSkillAccuracies =
    reliableSkills.map(
      (progress) =>
        progress.correct /
        progress.total,
    )

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
    return {
      title:
        'Ready for Medium',
      message:
        'Zeke has enough completed missions, strong overall accuracy, a higher reading level, and consistent results across multiple reading skills. The app can now introduce Medium missions.',
    }
  }

  /*
    --------------------------------
    STRONG RESULTS, BUT NOT MEDIUM YET
    --------------------------------
  */

  if (readingLevel < 2) {
    return {
      title:
        'Strong results — building reading level',
      message:
        'Zeke is performing well, but his adaptive reading level is still Level 1. The app will continue with Easy Plus while building enough evidence for Reading Level 2.',
    }
  }

  if (completedReadingMissions < 5) {
    return {
      title:
        'Strong results — gathering more mission data',
      message:
        'Zeke is doing very well. The app waits for at least 5 recorded reading missions before considering Medium difficulty.',
    }
  }

  if (reliableSkillsAtOrAbove70 < 2) {
    return {
      title:
        'Strong results — checking more skills',
      message:
        'Overall accuracy is strong, but the app needs at least two reading skills with enough recorded answers and 70% or better accuracy before moving to Medium.',
    }
  }

  return {
    title:
      'Building consistent skill strength',
    message:
      'Zeke is doing well overall. The app will continue with Easy Plus until the recorded reading skills are consistently strong enough for Medium.',
  }
}