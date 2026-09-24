import type {
  LearningSkill,
} from '../data/learningProfile'

import type {
  ReadingMissionPlan,
  QuestionMix,
} from './getNextReadingMissionPlan'

/*
  --------------------------------
  MISSION SPECIFICATION TYPES
  --------------------------------
*/

export type ReadingTheme =
  | 'adventure'
  | 'dinosaurs'
  | 'forest'
  | 'animals'
  | 'discovery'

export type ReadingQuestionRule = {
  skill: LearningSkill
  count: number
}

export type ReadingMissionSpecification = {
  /*
    Learner information
  */

  learnerAge: number
  readingLevel: number

  /*
    Mission structure
  */

  difficulty:
    ReadingMissionPlan['difficulty']

  storyPages: number

  questions: number

  /*
    Story rules
  */

  theme: ReadingTheme

  maximumWordsPerPage: number

  sentenceComplexity:
    ReadingMissionPlan['sentenceComplexity']

  vocabularyLevel:
    ReadingMissionPlan['vocabularyLevel']

  /*
    Adaptive learning information
  */

  prioritySkill: LearningSkill | null

  questionMix: QuestionMix

  questionRules: ReadingQuestionRule[]

  /*
    Question requirements
  */

  answerChoicesPerQuestion: number

  /*
    Content requirements
  */

  requirements: string[]

  /*
    Rules that generated content
    must never break.
  */

  restrictions: string[]
}

/*
  --------------------------------
  WORD LIMIT
  --------------------------------

  The adaptive planner chooses the
  sentence complexity.

  The specification converts that
  into an actual story constraint.
*/

function getMaximumWordsPerPage(
  plan: ReadingMissionPlan,
): number {
  if (
    plan.sentenceComplexity ===
    'very-short'
  ) {
    return 35
  }

  if (
    plan.sentenceComplexity ===
    'short'
  ) {
    return 55
  }

  return 80
}

/*
  --------------------------------
  QUESTION RULES
  --------------------------------

  Convert:

  {
    vocabulary: 2,
    inference: 1,
    reading-comprehension: 1
  }

  into explicit rules that will be
  easier for both the AI generator
  and validator to understand.
*/

function createQuestionRules(
  questionMix: QuestionMix,
): ReadingQuestionRule[] {
  return Object.entries(
    questionMix,
  ).map(
    ([skill, count]) => ({
      skill:
        skill as LearningSkill,

      count,
    }),
  )
}

/*
  --------------------------------
  CREATE SPECIFICATION
  --------------------------------
*/

export function getReadingMissionSpecification(
  plan: ReadingMissionPlan,
  learnerAge: number,
): ReadingMissionSpecification {
  return {
    /*
      Learner
    */

    learnerAge,

    readingLevel:
      plan.readingLevel,

    /*
      Mission
    */

    difficulty:
      plan.difficulty,

    storyPages:
      plan.storyPages,

    questions:
      plan.questions,

    /*
      Story
    */

    theme: 'adventure',

    maximumWordsPerPage:
      getMaximumWordsPerPage(plan),

    sentenceComplexity:
      plan.sentenceComplexity,

    vocabularyLevel:
      plan.vocabularyLevel,

    /*
      Adaptive learning
    */

    prioritySkill:
      plan.prioritySkill,

    questionMix:
      plan.questionMix,

    questionRules:
      createQuestionRules(
        plan.questionMix,
      ),

    /*
      Question format
    */

    answerChoicesPerQuestion: 3,

    /*
      REQUIRED CONTENT RULES
    */

    requirements: [
      'The story must be appropriate for the learner age.',

      'The story must use clear language appropriate for the selected reading level.',

      'Each story page must stay within the maximum word limit.',

      'Every question must assess the skill assigned to it.',

      'Reading comprehension answers must be supported directly by the story.',

      'Inference questions must be reasonably inferable from information in the story.',

      'Vocabulary questions must test words that appear in the story or are clearly introduced by the story.',

      'Sequencing questions must test the order of events that actually happen in the story.',

      'Every question must have exactly one correct answer.',

      'Every question must contain the required number of answer choices.',

      'The total number of generated questions must exactly match the mission specification.',

      'The generated question skill counts must exactly match the question mix.',
    ],

    /*
      RESTRICTIONS
    */

    restrictions: [
      'Do not include frightening, graphic, violent, sexual, discriminatory, or otherwise age-inappropriate content.',

      'Do not ask a question when the answer cannot be found or reasonably inferred from the story.',

      'Do not create trick questions.',

      'Do not create duplicate questions.',

      'Do not use unnecessarily complex vocabulary outside the selected vocabulary level.',

      'Do not exceed the maximum words allowed per story page.',

      'Do not change the requested number of story pages.',

      'Do not change the requested number of questions.',

      'Do not change the requested question skill distribution.',
    ],
  }
}