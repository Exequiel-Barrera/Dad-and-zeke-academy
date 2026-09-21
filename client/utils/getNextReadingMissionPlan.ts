import type {
  DifficultyLevel,
  LearningProfile,
  LearningSkill,
} from '../data/learningProfile'

export type ReadingMissionPlan = {
  readingLevel: number

  difficulty: DifficultyLevel

  prioritySkill: LearningSkill | null

  supportingSkills: LearningSkill[]

  storyPages: number

  questions: number

  sentenceComplexity:
    | 'very-short'
    | 'short'
    | 'medium'

  vocabularyLevel:
    | 'basic'
    | 'developing'
    | 'challenging'

  includeSequencing: boolean

  includeInference: boolean

  explanation: string
}

/*
  --------------------------------
  FIND PRIORITY SKILL
  --------------------------------

  We only allow a skill to become
  the priority after at least four
  answers have been recorded.

  This matches the evidence rule
  used by our adaptive system.
*/

function getPrioritySkill(
  profile: LearningProfile,
): LearningSkill | null {
  const skillEntries =
    Object.entries(
      profile.skillProgress,
    ) as [
      LearningSkill,
      {
        correct: number
        total: number
      },
    ][]

const reliableSkills =
  skillEntries.filter(
    ([, progress]) => {
      if (progress.total < 4) {
        return false
      }

      const accuracy =
        progress.correct /
        progress.total

      return accuracy < 0.85
    },
  )

  if (reliableSkills.length === 0) {
    return null
  }

  /*
    Sort from lowest accuracy
    to highest accuracy.
  */

  reliableSkills.sort(
    (a, b) => {
      const accuracyA =
        a[1].correct /
        a[1].total

      const accuracyB =
        b[1].correct /
        b[1].total

      return (
        accuracyA -
        accuracyB
      )
    },
  )

  return reliableSkills[0][0]
}

/*
  --------------------------------
  GET SUPPORTING SKILLS
  --------------------------------
*/

function getSupportingSkills(
  prioritySkill: LearningSkill | null,
): LearningSkill[] {
  const defaultSkills: LearningSkill[] =
    [
      'reading-comprehension',
      'vocabulary',
      'sequencing',
    ]

  /*
    Remove the priority skill so
    we don't list it twice.
  */

  return defaultSkills
    .filter(
      (skill) =>
        skill !== prioritySkill,
    )
    .slice(0, 2)
}

/*
  --------------------------------
  CREATE NEXT MISSION PLAN
  --------------------------------
*/

export function getNextReadingMissionPlan(
  profile: LearningProfile,
): ReadingMissionPlan {
  const prioritySkill =
    getPrioritySkill(profile)

  const supportingSkills =
    getSupportingSkills(
      prioritySkill,
    )

  /*
    --------------------------------
    BEGINNER
    --------------------------------
  */

  if (
    profile.currentDifficulty ===
    'beginner'
  ) {
    return {
      readingLevel:
        profile.readingLevel,

      difficulty: 'beginner',

      prioritySkill,

      supportingSkills,

      storyPages: 3,

      questions: 3,

      sentenceComplexity:
        'very-short',

      vocabularyLevel: 'basic',

      includeSequencing: false,

      includeInference: false,

      explanation: prioritySkill
        ? 'Keep the story short and give extra practice to the current priority skill.'
        : 'Keep the story short while collecting balanced reading evidence.',
    }
  }

  /*
    --------------------------------
    EASY
    --------------------------------
  */

  if (
    profile.currentDifficulty ===
    'easy'
  ) {
    return {
      readingLevel:
        profile.readingLevel,

      difficulty: 'easy',

      prioritySkill,

      supportingSkills,

      storyPages: 3,

      questions: 4,

      sentenceComplexity: 'short',

      vocabularyLevel: 'basic',

      includeSequencing: true,

      includeInference: false,

      explanation: prioritySkill
        ? 'Continue building confidence while giving additional practice to the weakest reliably measured skill.'
        : 'Introduce simple sequencing while continuing to collect balanced skill evidence.',
    }
  }

  /*
    --------------------------------
    EASY PLUS
    --------------------------------
  */

  if (
    profile.currentDifficulty ===
    'easy-plus'
  ) {
    return {
      readingLevel:
        profile.readingLevel,

      difficulty: 'easy-plus',

      prioritySkill,

      supportingSkills,

      storyPages: 4,

      questions: 4,

      sentenceComplexity: 'short',

      vocabularyLevel:
        'developing',

      includeSequencing: true,

      includeInference: true,

      explanation: prioritySkill
        ? 'Increase the challenge gradually while keeping extra practice focused on the priority skill.'
        : 'Introduce sequencing and simple inference while monitoring performance.',
    }
  }

  /*
    --------------------------------
    MEDIUM
    --------------------------------
  */

  return {
    readingLevel:
      profile.readingLevel,

    difficulty: 'medium',

    prioritySkill,

    supportingSkills,

    storyPages: 5,

    questions: 5,

    sentenceComplexity: 'medium',

    vocabularyLevel:
      'challenging',

    includeSequencing: true,

    includeInference: true,

    explanation: prioritySkill
      ? 'Use a longer story with deeper comprehension while continuing targeted practice.'
      : 'Use a longer story with comprehension, vocabulary, sequencing and inference challenges.',
  }
}