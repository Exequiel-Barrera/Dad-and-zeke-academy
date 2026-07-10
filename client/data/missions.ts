export const missions = [
  {
    id: 1,
    title: 'The Lost Dinosaur Egg',

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
      },

      {
        question: 'Where was the egg?',
        answers: [
          'Under a big tree',
          'On a bus',
          'Inside a house',
        ],
        correct: 'Under a big tree',
      },

      {
        question: 'Who did Rex ask for help?',
        answers: [
          'Zeke',
          'A pirate',
          'A dragon',
        ],
        correct: 'Zeke',
      },
    ],

    reward: 3,
  },
]