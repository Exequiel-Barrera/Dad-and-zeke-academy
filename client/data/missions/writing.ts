export type WritingMission = {
  id: string
  number: number
  title: string
  instruction: string
  sentence: string
  stars: number
}

export const writingMissions: WritingMission[] = [
  {
    id: 'writing-1',
    number: 1,
    title: 'The Green Dinosaur',
    instruction: 'Write the sentence shown below.',
    sentence: 'The green dinosaur walked through the forest.',
    stars: 3,
  },
  {
    id: 'writing-2',
    number: 2,
    title: 'The Flying Dragon',
    instruction: 'Write the sentence shown below.',
    sentence: 'The flying dragon soared above the mountains.',
    stars: 3,
  },
]