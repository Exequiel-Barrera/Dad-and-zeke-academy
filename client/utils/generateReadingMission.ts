import type {
  LearningSkill,
} from '../data/learningProfile'

import type {
  ReadingMissionSpecification,
} from './getReadingMissionSpecification'

import type {
  GeneratedReadingMission,
  GeneratedReadingQuestion,
  GeneratedStoryPage,
} from './validateReadingMission'

/*
  --------------------------------
  LOCAL READING MISSION GENERATOR
  --------------------------------

  This is our first mission generator.

  For now it is deliberately local
  and predictable.

  Later an AI generator can replace
  the content-generation part while
  keeping the same mission structure,
  specification and validator.
*/

/*
  --------------------------------
  STORY
  --------------------------------
*/

function createStoryPages(
  specification: ReadingMissionSpecification,
): GeneratedStoryPage[] {
  const storyTexts = [
    'Rex walks through the forest and notices small footprints beside the trail.',

    'The footprints lead Rex toward a quiet river. A little blue dinosaur is standing beside the water.',

    'The dinosaur looks worried because its red backpack is missing. Rex decides to help search for it.',

    'Rex finds the red backpack under a fallen branch near the river. The little dinosaur smiles and thanks him.',
  ]

  return Array.from(
    {
      length: specification.storyPages,
    },
    (_, index) => ({
      pageNumber: index + 1,

      text:
        storyTexts[index] ??
        'Rex continues exploring the forest carefully.',
    }),
  )
}

/*
  --------------------------------
  QUESTION TEMPLATES
  --------------------------------

  Each template already contains
  evidence that can be checked by
  our mission validator.
*/

const questionTemplates: Record<
  LearningSkill,
  GeneratedReadingQuestion[]
> = {
  'reading-comprehension': [
    {
      id: 'generated-comprehension-1',

      skill: 'reading-comprehension',

      question:
        'What did Rex find under the fallen branch?',

      choices: [
        'The red backpack',
        'A yellow ball',
        'A green hat',
      ],

      correctAnswerIndex: 0,

      evidence: {
        storyPage: 4,

        excerpt:
          'Rex finds the red backpack under a fallen branch near the river.',

        explanation:
          'Page 4 directly tells us that Rex finds the red backpack under the fallen branch.',
      },
    },
  ],

  vocabulary: [
    {
      id: 'generated-vocabulary-1',

      skill: 'vocabulary',

      question:
        'What does worried mean in the story?',

      choices: [
        'Feeling concerned about something',
        'Feeling very sleepy',
        'Feeling excited about a game',
      ],

      correctAnswerIndex: 0,

      evidence: {
        storyPage: 3,

        excerpt:
          'The dinosaur looks worried because its red backpack is missing.',

        explanation:
          'The dinosaur is worried because something important is missing.',
      },
    },

    {
      id: 'generated-vocabulary-2',

      skill: 'vocabulary',

      question:
        'What does quiet mean when describing the river?',

      choices: [
        'Not making much noise',
        'Very crowded',
        'Moving through the sky',
      ],

      correctAnswerIndex: 0,

      evidence: {
        storyPage: 2,

        excerpt:
          'The footprints lead Rex toward a quiet river.',

        explanation:
          'The word quiet describes the river as not making much noise.',
      },
    },
  ],

  sequencing: [
    {
      id: 'generated-sequencing-1',

      skill: 'sequencing',

      question:
        'What happened before Rex found the backpack?',

      choices: [
        'Rex decided to help search for it',
        'The dinosaur thanked Rex',
        'Rex went home',
      ],

      correctAnswerIndex: 0,

      evidence: {
        storyPage: 3,

        excerpt:
          'Rex decides to help search for it.',

        explanation:
          'Rex decides to search on page 3 before finding the backpack on page 4.',
      },
    },
  ],

  inference: [
    {
      id: 'generated-inference-1',

      skill: 'inference',

      question:
        'Why did the little dinosaur smile at the end?',

      choices: [
        'Because Rex found the missing backpack',
        'Because it started raining',
        'Because Rex lost the footprints',
      ],

      correctAnswerIndex: 0,

      evidence: {
        storyPage: 4,

        excerpt:
          'The little dinosaur smiles and thanks him.',

        explanation:
          'The dinosaur smiles after Rex finds its missing backpack, so we can infer that it is happy to have it back.',
      },
    },
  ],

  'sentence-building': [
    {
      id: 'generated-sentence-building-1',

      skill: 'sentence-building',

      question:
        'Which sentence best describes what Rex did?',

      choices: [
        'Rex found the red backpack.',
        'Rex backpack red found.',
        'Found Rex red the backpack.',
      ],

      correctAnswerIndex: 0,

      evidence: {
        storyPage: 4,

        excerpt:
          'Rex finds the red backpack under a fallen branch near the river.',

        explanation:
          'Page 4 gives the information needed to build the sentence correctly.',
      },
    },
  ],
}

/*
  --------------------------------
  CREATE QUESTIONS
  --------------------------------

  The specification decides how
  many questions of each skill the
  mission needs.
*/

function createQuestions(
  specification: ReadingMissionSpecification,
): GeneratedReadingQuestion[] {
  const questions: GeneratedReadingQuestion[] =
    []

  for (
    const rule of
    specification.questionRules
  ) {
    const templates =
      questionTemplates[rule.skill]

    for (
      let index = 0;
      index < rule.count;
      index += 1
    ) {
      const template =
        templates[
          index % templates.length
        ]

      questions.push({
        ...template,

        id: `${template.id}-${questions.length + 1}`,

        choices: [
          ...template.choices,
        ],

        evidence: {
          ...template.evidence,
        },
      })
    }
  }

  return questions
}

/*
  --------------------------------
  GENERATE READING MISSION
  --------------------------------
*/

export function generateReadingMission(
  specification: ReadingMissionSpecification,
): GeneratedReadingMission {
  const storyPages =
    createStoryPages(specification)

  const questions =
    createQuestions(specification)

  return {
    title:
      'Rex and the Missing Backpack',

    storyPages,

    questions,
  }
}