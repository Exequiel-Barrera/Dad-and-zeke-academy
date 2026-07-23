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
  {
  id: 'writing-3',
  number: 3,
  title: 'Rex Finds the River',
  instruction: 'Carefully copy the sentence shown below.',
  sentence: 'Rex found a clear river beside the green forest.',
  stars: 3,
},
{
  id: 'writing-4',
  number: 4,
  title: 'Pandalolo Helps a Friend',
  instruction: 'Write the sentence using spaces and punctuation.',
  sentence: 'Pandalolo helped the little dinosaur cross the bridge.',
  stars: 4,
},
{
  id: 'writing-5',
  number: 5,
  title: 'The Dinosaur Family',
  instruction: 'Copy the complete sentence shown below.',
  sentence: 'The dinosaur family was happy to have their egg back.',
  stars: 4,
},
]
