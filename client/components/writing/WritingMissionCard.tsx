import { Link } from 'react-router'

function WritingMissionCard() {
  return (
    <section className="mt-10 rounded-3xl bg-white p-8 text-center shadow-xl">
      <p className="text-5xl">✏️✨</p>

      <h2 className="mt-4 text-4xl font-bold text-purple-900">
        Mission 1: Build a Super Sentence
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-xl">
        Help Pandalolo build a sentence using a capital letter, spaces between
        words, and a full stop.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <span className="rounded-full bg-purple-100 px-4 py-2 font-bold">
          Capital letter
        </span>

        <span className="rounded-full bg-purple-100 px-4 py-2 font-bold">
          Word spaces
        </span>

        <span className="rounded-full bg-purple-100 px-4 py-2 font-bold">
          Full stop
        </span>
      </div>
      <Link
         to="/writing/mission-1"
          className="mt-8 inline-block rounded-2xl bg-purple-700 px-10 py-5 text-2xl font-bold text-white hover:bg-purple-800"
            >
              Start Writing Mission
       </Link>
      
    </section>
  )
}

export default WritingMissionCard