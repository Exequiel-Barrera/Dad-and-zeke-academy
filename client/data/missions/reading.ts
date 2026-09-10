import type {
  DifficultyLevel,
  LearningSkill,
} from './learningProfile'

export type ReadingMission = {
  id: string
  number: number
  title: string
  reward: number

  difficulty: DifficultyLevel

  recommendedAge: {
    min: number
    max: number
  }

  skills: LearningSkill[]

  pages: {
    id: number
    text: string
  }[]

  questions: {
    question: string
    answers: string[]
    correct: string
    skill: LearningSkill
  }[]
}

export const readingMissions: ReadingMission[] = [
  {
    id: 'reading-1',
    number: 1,
    title: 'The Lost Dinosaur Egg',
    reward: 3,

    difficulty: 'beginner',

    recommendedAge: {
      min: 5,
      max: 7,
    },

    skills: [
      'reading-comprehension',
      'vocabulary',
    ],

    pages: [
      {
        id: 1,
        text: 'Rex was walking through Reading Forest when he found a shiny egg under a big tree.',
      },
      {
        id: 2,
        text: 'Rex looked around but could not find the dinosaur family.',
      },
      {
        id: 3,
        text: 'Rex smiled at Zeke and asked, "Can you help me solve the mystery?"',
      },
    ],

    questions: [
      {
        question: 'What did Rex find?',
        answers: [
          'A shiny egg',
          'A blue hat',
          'A red car',
        ],
        correct: 'A shiny egg',
        skill: 'reading-comprehension',
      },
      {
        question: 'Where was the egg?',
        answers: [
          'Under a big tree',
          'On a bus',
          'Inside a house',
        ],
        correct: 'Under a big tree',
        skill: 'reading-comprehension',
      },
      {
        question:
          'What does the word "mystery" mean in this story?',
        answers: [
          'Something that needs to be solved',
          'A kind of dinosaur',
          'A place to sleep',
        ],
        correct:
          'Something that needs to be solved',
        skill: 'vocabulary',
      },
    ],
  },

  {
    id: 'reading-2',
    number: 2,
    title: 'The Friendly Triceratops',
    reward: 3,

    difficulty: 'easy',

    recommendedAge: {
      min: 5,
      max: 7,
    },

    skills: [
      'reading-comprehension',
      'sequencing',
    ],

    pages: [
      {
        id: 1,
        text: 'Rex and Zeke followed a trail of tiny footprints through Reading Forest.',
      },
      {
        id: 2,
        text: 'Near a quiet river, they found a young triceratops drinking water.',
      },
      {
        id: 3,
        text: 'The triceratops smiled and explained that the shiny egg belonged to her family.',
      },
    ],

    questions: [
      {
        question:
          'What did Rex and Zeke follow?',
        answers: [
          'Tiny footprints',
          'A yellow bus',
          'A flying balloon',
        ],
        correct: 'Tiny footprints',
        skill: 'reading-comprehension',
      },
      {
        question:
          'Where did they find the triceratops?',
        answers: [
          'Near a quiet river',
          'Inside a shop',
          'On top of a house',
        ],
        correct: 'Near a quiet river',
        skill: 'reading-comprehension',
      },
      {
        question:
          'What happened after Rex and Zeke followed the footprints?',
        answers: [
          'They found a triceratops near the river',
          'They went back to camp',
          'They found a flying balloon',
        ],
        correct:
          'They found a triceratops near the river',
        skill: 'sequencing',
      },
    ],
  },

  {
    id: 'reading-3',
    number: 3,
    title: 'The River Bridge Rescue',
    reward: 4,

    difficulty: 'easy-plus',

    recommendedAge: {
      min: 6,
      max: 8,
    },

    skills: [
      'reading-comprehension',
      'sequencing',
      'inference',
    ],

    pages: [
      {
        id: 1,
        text: 'Rex, Zeke, and the young triceratops carried the egg toward her home.',
      },
      {
        id: 2,
        text: 'When they reached the river, they discovered that the wooden bridge was broken.',
      },
      {
        id: 3,
        text: 'Zeke found strong branches, and the friends worked together to repair the bridge.',
      },
      {
        id: 4,
        text: 'They safely crossed the river and returned the egg to its grateful dinosaur family.',
      },
    ],

    questions: [
      {
        question:
          'What were the friends carrying?',
        answers: [
          'The shiny egg',
          'A treasure chest',
          'A red bicycle',
        ],
        correct: 'The shiny egg',
        skill: 'reading-comprehension',
      },
      {
        question:
          'What happened before the friends repaired the bridge?',
        answers: [
          'They discovered the bridge was broken',
          'They returned the egg',
          'They went back to camp',
        ],
        correct:
          'They discovered the bridge was broken',
        skill: 'sequencing',
      },
      {
        question:
          'What did Zeke find to help repair the bridge?',
        answers: [
          'Strong branches',
          'A magic wand',
          'A green umbrella',
        ],
        correct: 'Strong branches',
        skill: 'reading-comprehension',
      },
      {
        question:
          'Why were the strong branches useful?',
        answers: [
          'They could help repair the bridge',
          'They could make the egg fly',
          'They could turn into a dinosaur',
        ],
        correct:
          'They could help repair the bridge',
        skill: 'inference',
      },
    ],
  },
]