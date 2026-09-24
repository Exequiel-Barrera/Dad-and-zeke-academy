import type {
  LearningSkill,
} from '../data/learningProfile'

import type {
  ReadingMissionSpecification,
} from './getReadingMissionSpecification'

/*
  --------------------------------
  GENERATED MISSION TYPES
  --------------------------------

  Later, this is the structure we will
  require the AI generator to return.
*/

export type GeneratedStoryPage = {
  pageNumber: number
  text: string
}

export type GeneratedReadingQuestion = {
  id: string

  skill: LearningSkill

  question: string

  choices: string[]

  correctAnswerIndex: number
}

export type GeneratedReadingMission = {
  title: string

  storyPages: GeneratedStoryPage[]

  questions: GeneratedReadingQuestion[]
}

/*
  --------------------------------
  VALIDATION RESULT
  --------------------------------
*/

export type MissionValidationResult = {
  valid: boolean
  errors: string[]
}

/*
  --------------------------------
  WORD COUNT
  --------------------------------
*/

function countWords(
  text: string,
): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
}

/*
  --------------------------------
  DUPLICATE QUESTIONS
  --------------------------------
*/

function normaliseText(
  text: string,
): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/*
  --------------------------------
  VALIDATE MISSION
  --------------------------------
*/

export function validateReadingMission(
  mission: GeneratedReadingMission,
  specification: ReadingMissionSpecification,
): MissionValidationResult {
  const errors: string[] = []

  /*
    --------------------------------
    BASIC MISSION DATA
    --------------------------------
  */

  if (!mission.title.trim()) {
    errors.push(
      'Mission must have a title.',
    )
  }

  /*
    --------------------------------
    STORY PAGE COUNT
    --------------------------------
  */

  if (
    mission.storyPages.length !==
    specification.storyPages
  ) {
    errors.push(
      `Expected ${specification.storyPages} story pages but received ${mission.storyPages.length}.`,
    )
  }

  /*
    --------------------------------
    STORY PAGE VALIDATION
    --------------------------------
  */

  mission.storyPages.forEach(
    (page, index) => {
      if (!page.text.trim()) {
        errors.push(
          `Story page ${index + 1} is empty.`,
        )
      }

      const wordCount =
        countWords(page.text)

      if (
        wordCount >
        specification.maximumWordsPerPage
      ) {
        errors.push(
          `Story page ${index + 1} contains ${wordCount} words. Maximum allowed is ${specification.maximumWordsPerPage}.`,
        )
      }

      if (
        page.pageNumber !==
        index + 1
      ) {
        errors.push(
          `Story page ${index + 1} has an incorrect page number.`,
        )
      }
    },
  )

  /*
    --------------------------------
    TOTAL QUESTION COUNT
    --------------------------------
  */

  if (
    mission.questions.length !==
    specification.questions
  ) {
    errors.push(
      `Expected ${specification.questions} questions but received ${mission.questions.length}.`,
    )
  }

  /*
    --------------------------------
    INDIVIDUAL QUESTIONS
    --------------------------------
  */

  mission.questions.forEach(
    (question, index) => {
      const questionNumber =
        index + 1

      if (!question.id.trim()) {
        errors.push(
          `Question ${questionNumber} is missing an ID.`,
        )
      }

      if (!question.question.trim()) {
        errors.push(
          `Question ${questionNumber} has no question text.`,
        )
      }

      /*
        Exact number of answer choices.
      */

      if (
        question.choices.length !==
        specification.answerChoicesPerQuestion
      ) {
        errors.push(
          `Question ${questionNumber} must have exactly ${specification.answerChoicesPerQuestion} answer choices.`,
        )
      }

      /*
        Empty answer choices.
      */

      question.choices.forEach(
        (choice, choiceIndex) => {
          if (!choice.trim()) {
            errors.push(
              `Question ${questionNumber}, choice ${choiceIndex + 1} is empty.`,
            )
          }
        },
      )

      /*
        Correct answer must point to
        a real answer choice.
      */

      if (
        !Number.isInteger(
          question.correctAnswerIndex,
        ) ||
        question.correctAnswerIndex < 0 ||
        question.correctAnswerIndex >=
          question.choices.length
      ) {
        errors.push(
          `Question ${questionNumber} has an invalid correct answer index.`,
        )
      }

      /*
        Prevent duplicate answer
        choices within a question.
      */

      const normalisedChoices =
        question.choices.map(
          normaliseText,
        )

      if (
        new Set(normalisedChoices).size !==
        normalisedChoices.length
      ) {
        errors.push(
          `Question ${questionNumber} contains duplicate answer choices.`,
        )
      }
    },
  )

  /*
    --------------------------------
    DUPLICATE QUESTION TEXT
    --------------------------------
  */

  const questionTexts =
    mission.questions.map(
      (question) =>
        normaliseText(
          question.question,
        ),
    )

  if (
    new Set(questionTexts).size !==
    questionTexts.length
  ) {
    errors.push(
      'Mission contains duplicate questions.',
    )
  }

  /*
    --------------------------------
    QUESTION SKILL DISTRIBUTION
    --------------------------------
  */

  const actualSkillCounts =
    mission.questions.reduce<
      Partial<Record<LearningSkill, number>>
    >(
      (counts, question) => {
        counts[question.skill] =
          (counts[question.skill] ?? 0) +
          1

        return counts
      },
      {},
    )

  for (
    const rule of
    specification.questionRules
  ) {
    const actualCount =
      actualSkillCounts[
        rule.skill
      ] ?? 0

    if (
      actualCount !== rule.count
    ) {
      errors.push(
        `Expected ${rule.count} ${rule.skill} question(s) but received ${actualCount}.`,
      )
    }
  }

  /*
    Catch skills that the specification
    did not request at all.
  */

  for (
    const [
      skill,
      actualCount,
    ] of Object.entries(
      actualSkillCounts,
    )
  ) {
    const expectedCount =
      specification.questionMix[
        skill as LearningSkill
      ] ?? 0

    if (
      actualCount !== expectedCount
    ) {
      const alreadyReported =
        specification.questionRules.some(
          (rule) =>
            rule.skill === skill,
        )

      if (!alreadyReported) {
        errors.push(
          `Unexpected ${skill} question(s) were generated.`,
        )
      }
    }
  }

  /*
    --------------------------------
    UNIQUE QUESTION IDS
    --------------------------------
  */

  const questionIds =
    mission.questions
      .map(
        (question) =>
          question.id.trim(),
      )
      .filter(Boolean)

  if (
    new Set(questionIds).size !==
    questionIds.length
  ) {
    errors.push(
      'Question IDs must be unique.',
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}