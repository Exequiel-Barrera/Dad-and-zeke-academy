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
*/

export type GeneratedStoryPage = {
  pageNumber: number
  text: string
}

/*
  Every generated question must
  provide evidence from the story.

  storyPage:
    Which page contains the evidence.

  excerpt:
    Exact text copied from that page.

  explanation:
    Why that evidence supports the
    question / correct answer.
*/

export type QuestionEvidence = {
  storyPage: number
  excerpt: string
  explanation: string
}

export type GeneratedReadingQuestion = {
  id: string

  skill: LearningSkill

  question: string

  choices: string[]

  correctAnswerIndex: number

  evidence: QuestionEvidence
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
  NORMALISE TEXT
  --------------------------------

  This lets us compare text while
  ignoring differences in:

  - uppercase / lowercase
  - extra spaces
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
      const pageNumber = index + 1

      if (!page.text.trim()) {
        errors.push(
          `Story page ${pageNumber} is empty.`,
        )
      }

      const wordCount =
        countWords(page.text)

      if (
        wordCount >
        specification.maximumWordsPerPage
      ) {
        errors.push(
          `Story page ${pageNumber} contains ${wordCount} words. Maximum allowed is ${specification.maximumWordsPerPage}.`,
        )
      }

      if (
        page.pageNumber !==
        pageNumber
      ) {
        errors.push(
          `Story page ${pageNumber} has an incorrect page number.`,
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

      /*
        QUESTION ID
      */

      if (!question.id.trim()) {
        errors.push(
          `Question ${questionNumber} is missing an ID.`,
        )
      }

      /*
        QUESTION TEXT
      */

      if (!question.question.trim()) {
        errors.push(
          `Question ${questionNumber} has no question text.`,
        )
      }

      /*
        --------------------------------
        ANSWER CHOICE COUNT
        --------------------------------
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
        --------------------------------
        EMPTY ANSWER CHOICES
        --------------------------------
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
        --------------------------------
        CORRECT ANSWER INDEX
        --------------------------------

        Arrays start at 0:

        0 = first answer
        1 = second answer
        2 = third answer
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
        --------------------------------
        EVIDENCE GROUNDING
        --------------------------------
      */

      if (!question.evidence) {
        errors.push(
          `Question ${questionNumber} is missing story evidence.`,
        )
      } else {
        const evidence =
          question.evidence

        /*
          STEP 1:
          Evidence must reference a
          real story page.
        */

        const validEvidencePage =
          Number.isInteger(
            evidence.storyPage,
          ) &&
          evidence.storyPage >= 1 &&
          evidence.storyPage <=
            mission.storyPages.length

        if (!validEvidencePage) {
          errors.push(
            `Question ${questionNumber} references an invalid evidence page.`,
          )
        }

        /*
          STEP 2:
          Evidence must include an
          exact story excerpt.
        */
if (
  typeof evidence.excerpt !== 'string' ||
  !evidence.excerpt.trim()
) {
  errors.push(
    `Question ${questionNumber} is missing an evidence excerpt.`,
  )
}

        /*
          STEP 3:
          Evidence must include an
          explanation.
        */

    if (
  typeof evidence.explanation !== 'string' ||
  !evidence.explanation.trim()
) {
  errors.push(
    `Question ${questionNumber} is missing an evidence explanation.`,
  )
}

        /*
          --------------------------------
          LAYER 2:
          VERIFY THE EXCERPT
          --------------------------------

          If the page exists and an
          excerpt was supplied, check
          that the excerpt actually
          appears on that story page.
        */

     if (
  validEvidencePage &&
  typeof evidence.excerpt === 'string' &&
  evidence.excerpt.trim()
) {
          const referencedPage =
            mission.storyPages[
              evidence.storyPage - 1
            ]

          const storyText =
            normaliseText(
              referencedPage.text,
            )

          const evidenceExcerpt =
            normaliseText(
              evidence.excerpt,
            )

          if (
            !storyText.includes(
              evidenceExcerpt,
            )
          ) {
            errors.push(
              `Question ${questionNumber}'s evidence excerpt was not found on story page ${evidence.storyPage}.`,
            )
          }
        }
      }

      /*
        --------------------------------
        DUPLICATE ANSWER CHOICES
        --------------------------------
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
      Partial<
        Record<
          LearningSkill,
          number
        >
      >
    >(
      (counts, question) => {
        counts[question.skill] =
          (counts[question.skill] ?? 0) +
          1

        return counts
      },
      {},
    )

  /*
    Check the skills requested by
    the mission specification.
  */

  for (
    const rule of
    specification.questionRules
  ) {
    const actualCount =
      actualSkillCounts[
        rule.skill
      ] ?? 0

    if (
      actualCount !==
      rule.count
    ) {
      errors.push(
        `Expected ${rule.count} ${rule.skill} question(s) but received ${actualCount}.`,
      )
    }
  }

  /*
    --------------------------------
    UNEXPECTED SKILLS
    --------------------------------
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
      actualCount !==
      expectedCount
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

  /*
    --------------------------------
    FINAL RESULT
    --------------------------------
  */

  return {
    valid: errors.length === 0,
    errors,
  }
}