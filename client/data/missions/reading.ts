export type ReadingMission = {
  id: string
  number: number
  title: string
  reward: number
  pages: {
    id: number
    text: string
  }[]
  questions: {
    question: string
    answers: string[]
    correct: string
  }[]
}

export const readingMissions: ReadingMission[] = [
  {
    id: 'reading-1',
    number: 1,
    title: 'The Lost Dinosaur Egg',
    reward: 3,

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
        answers: ['A shiny egg', 'A blue hat', 'A red car'],
        correct: 'A shiny egg',
      },
      {
        question: 'Where was the egg?',
        answers: ['Under a big tree', 'On a bus', 'Inside a house'],
        correct: 'Under a big tree',
      },
      {
        question: 'Who did Rex ask for help?',
        answers: ['Zeke', 'A pirate', 'A dragon'],
        correct: 'Zeke',
      },
    ],
  },

  {
    id: 'reading-2',
    number: 2,
    title: 'The Friendly Triceratops',
    reward: 3,

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
        question: 'What did Rex and Zeke follow?',
        answers: [
          'Tiny footprints',
          'A yellow bus',
          'A flying balloon',
        ],
        correct: 'Tiny footprints',
      },
      {
        question: 'Where did they find the triceratops?',
        answers: [
          'Near a quiet river',
          'Inside a shop',
          'On top of a house',
        ],
        correct: 'Near a quiet river',
      },
      {
        question: 'Who did the egg belong to?',
        answers: [
          'The triceratops family',
          'A pirate',
          'A robot',
        ],
        correct: 'The triceratops family',
      },
    ],
  },

  {
    id: 'reading-3',
    number: 3,
    title: 'The River Bridge Rescue',
    reward: 4,

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
        question: 'What were the friends carrying?',
        answers: [
          'The shiny egg',
          'A treasure chest',
          'A red bicycle',
        ],
        correct: 'The shiny egg',
      },
      {
        question: 'What was broken?',
        answers: [
          'The wooden bridge',
          'A toy train',
          'The dinosaur egg',
        ],
        correct: 'The wooden bridge',
      },
      {
        question: 'What did Zeke find?',
        answers: [
          'Strong branches',
          'A magic wand',
          'A green umbrella',
        ],
        correct: 'Strong branches',
      },
      {
        question: 'How did they solve the problem?',
        answers: [
          'They worked together',
          'They went home',
          'They waited for a pirate',
        ],
        correct: 'They worked together',
      },
    ],
  },
]