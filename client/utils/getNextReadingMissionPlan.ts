import type {
  DifficultyLevel,
  LearningProfile,
  LearningSkill,
} from '../data/learningProfile'

export type QuestionMix = Partial<
  Record<LearningSkill, number>
>

export type ReadingMissionPlan = {
  readingLevel: number

  difficulty: DifficultyLevel

  prioritySkill: LearningSkill | null

  supportingSkills: LearningSkill[]

  storyPages: number

  questions: number

  questionMix: QuestionMix

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

  A skill can become a priority only
  when:

  1. It has at least 4 answers.
  2. Accuracy is below 85%.

  This prevents a strong skill from
  being labelled as needing extra
  practice.
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

  const priorityCandidates =
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

  if (priorityCandidates.length === 0) {
    return null
  }

  /*
    Lowest reliable accuracy becomes
    the current priority.
  */

  priorityCandidates.sort(
    (a, b) => {
      const accuracyA =
        a[1].correct /
        a[1].total

      const accuracyB =
        b[1].correct /
        b[1].total

      return accuracyA - accuracyB
    },
  )

  return priorityCandidates[0][0]
}

/*
  --------------------------------
  FIND SKILLS NEEDING EVIDENCE
  --------------------------------

  These are skills with fewer than
  4 recorded answers.

  The mission planner can introduce
  these gradually so the app learns
  more about Zeke without treating
  them as weaknesses.
*/

function getSkillsNeedingEvidence(
  profile: LearningProfile,
): LearningSkill[] {
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

  return skillEntries
    .filter(
      ([skill, progress]) =>
        progress.total < 4 &&
        skill !== 'sentence-building',
    )
    .sort(
      (a, b) =>
        a[1].total - b[1].total,
    )
    .map(([skill]) => skill)
}

/*
  --------------------------------
  SUPPORTING SKILLS
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
      'inference',
    ]

  return defaultSkills
    .filter(
      (skill) =>
        skill !== prioritySkill,
    )
    .slice(0, 2)
}

/*
  --------------------------------
  CREATE QUESTION MIX
  --------------------------------

  The planner has two goals:

  1. Give extra practice to a
     demonstrated priority skill.

  2. Collect evidence for skills
     that have not been tested
     enough yet.
*/

function createQuestionMix(
  profile: LearningProfile,
  prioritySkill: LearningSkill | null,
  totalQuestions: number,
  allowSequencing: boolean,
  allowInference: boolean,
): QuestionMix {
  const mix: QuestionMix = {}

  let remainingQuestions =
    totalQuestions

  /*
    --------------------------------
    PRIORITY PRACTICE

    If a real priority exists, use
    up to 2 questions for it.
    --------------------------------
  */

  if (
    prioritySkill &&
    remainingQuestions > 0
  ) {
    const priorityQuestions =
      Math.min(
        2,
        remainingQuestions,
      )

    mix[prioritySkill] =
      priorityQuestions

    remainingQuestions -=
      priorityQuestions
  }

  /*
    --------------------------------
    COLLECT MISSING EVIDENCE
    --------------------------------
  */

  const skillsNeedingEvidence =
    getSkillsNeedingEvidence(profile)

  for (const skill of skillsNeedingEvidence) {
    if (remainingQuestions <= 0) {
      break
    }

    /*
      Do not introduce skills before
      the current difficulty allows
      them.
    */

    if (
      skill === 'sequencing' &&
      !allowSequencing
    ) {
      continue
    }

    if (
      skill === 'inference' &&
      !allowInference
    ) {
      continue
    }

    /*
      Avoid adding another question
      here if this skill is already
      receiving priority questions.
    */

    if (mix[skill]) {
      continue
    }

    mix[skill] = 1

    remainingQuestions -= 1
  }

  /*
    --------------------------------
    BALANCED REMAINING QUESTIONS
    --------------------------------

    Reading comprehension is our
    default foundation skill.

    Vocabulary is the secondary
    foundation skill.
  */

  const fallbackSkills: LearningSkill[] =
    [
      'reading-comprehension',
      'vocabulary',
    ]

  let fallbackIndex = 0

  while (remainingQuestions > 0) {
    const skill =
      fallbackSkills[
        fallbackIndex %
          fallbackSkills.length
      ]

    mix[skill] =
      (mix[skill] ?? 0) + 1

    remainingQuestions -= 1

    fallbackIndex += 1
  }

  return mix
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
    const questions = 3

    return {
      readingLevel:
        profile.readingLevel,

      difficulty: 'beginner',

      prioritySkill,

      supportingSkills,

      storyPages: 3,

      questions,

      questionMix:
        createQuestionMix(
          profile,
          prioritySkill,
          questions,
          false,
          false,
        ),

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
    const questions = 4

    return {
      readingLevel:
        profile.readingLevel,

      difficulty: 'easy',

      prioritySkill,

      supportingSkills,

      storyPages: 3,

      questions,

      questionMix:
        createQuestionMix(
          profile,
          prioritySkill,
          questions,
          true,
          false,
        ),

      sentenceComplexity: 'short',

      vocabularyLevel: 'basic',

      includeSequencing: true,

      includeInference: false,

      explanation: prioritySkill
        ? 'Continue building confidence while giving additional practice to the priority skill.'
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
    const questions = 4

    return {
      readingLevel:
        profile.readingLevel,

      difficulty: 'easy-plus',

      prioritySkill,

      supportingSkills,

      storyPages: 4,

      questions,

      questionMix:
        createQuestionMix(
          profile,
          prioritySkill,
          questions,
          true,
          true,
        ),

      sentenceComplexity: 'short',

      vocabularyLevel:
        'developing',

      includeSequencing: true,

      includeInference: true,

      explanation: prioritySkill
        ? 'Keep the overall challenge appropriate while giving extra practice to the priority skill and collecting evidence from other reading skills.'
        : 'Introduce sequencing and simple inference while continuing to collect balanced reading evidence.',
    }
  }

  /*
    --------------------------------
    MEDIUM
    --------------------------------
  */

  const questions = 5

  return {
    readingLevel:
      profile.readingLevel,

    difficulty: 'medium',

    prioritySkill,

    supportingSkills,

    storyPages: 5,

    questions,

    questionMix:
      createQuestionMix(
        profile,
        prioritySkill,
        questions,
        true,
        true,
      ),

    sentenceComplexity: 'medium',

    vocabularyLevel:
      'challenging',

    includeSequencing: true,

    includeInference: true,

    explanation: prioritySkill
      ? 'Use a longer story with deeper comprehension while continuing targeted practice and collecting balanced skill evidence.'
      : 'Use a longer story with comprehension, vocabulary, sequencing and inference challenges.',
  }
}