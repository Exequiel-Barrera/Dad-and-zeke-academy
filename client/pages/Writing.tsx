import Pandalolo from '../components/characters/Pandalolo.tsx'
import WritingMissionCard from '../components/writing/WritingMissionCard.tsx'

function Writing() {
  return (
    
    <section className="flex min-h-[75vh] items-center justify-center rounded-3xl bg-purple-100 p-8">
      <div className="mx-auto max-w-5xl text-center">
  <Pandalolo
    size="medium"
    message="Hello Explorer Zeke! I'm Pandalolo. Today we're going to create an amazing story together!"
  />

  <h1 className="mt-8 text-5xl font-bold text-purple-900">
    Pandalolo&apos;s Writer&apos;s Workshop
  </h1>

  <p className="mt-4 text-2xl">
    Build words, sentences and stories with Pandalolo.
  </p>

  <WritingMissionCard />
</div>
    </section>
  )
}

export default Writing