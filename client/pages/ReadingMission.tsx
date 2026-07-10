import { useState } from 'react'
import { Link } from 'react-router'

import StoryCard from '../components/mission/StoryCard'
import { missions } from '../data/missions'

function ReadingMission() {
  const mission = missions[0]
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const correctAnswer = 'A shiny egg'

  return (
    <section className="min-h-[80vh] rounded-3xl bg-green-100 p-10 shadow-lg">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow">
        <p className="text-center text-6xl">🦖🥚🌲</p>

        <h1 className="mt-4 text-center text-5xl font-bold text-green-900">
          Mission 1: The Lost Dinosaur Egg
        </h1>

        <StoryCard
             text={mission.pages[currentPage].text}
              pageNumber={currentPage + 1}
              totalPages={mission.pages.length}
              />
<div className="mt-8 flex justify-between">
  <button
    disabled={currentPage === 0}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="rounded-xl bg-gray-300 px-6 py-3 disabled:opacity-50"
  >
    ← Previous
  </button>

  <button
    disabled={currentPage === mission.pages.length - 1}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="rounded-xl bg-green-700 px-6 py-3 font-bold text-white disabled:opacity-50"
  >
    Next →
  </button>
</div>
        

        <div className="mt-8 rounded-2xl bg-green-50 p-6">
          <h2 className="text-3xl font-bold text-green-900">Question 1</h2>

          <p className="mt-4 text-2xl">What did Rex find in Reading Forest?</p>

          <div className="mt-6 grid gap-4">
            {['A shiny egg', 'A red car', 'A blue hat'].map((answer) => (
              <button
                key={answer}
                onClick={() => setSelectedAnswer(answer)}
                className="rounded-2xl bg-white p-4 text-2xl font-bold shadow hover:bg-green-200"
              >
                {answer}
              </button>
            ))}
          </div>

          {selectedAnswer && (
            <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow">
              {selectedAnswer === correctAnswer ? (
                <>
                  <p className="text-5xl">🎉</p>
                  <p className="mt-2 text-2xl font-bold text-green-800">
                    Correct! Rex found a shiny egg.
                  </p>
                  <p className="mt-2 text-xl">⭐ You earned 1 star!</p>
                </>
              ) : (
                <>
                  <p className="text-5xl">🦖</p>
                  <p className="mt-2 text-2xl font-bold text-orange-700">
                    Good try, Explorer. Read the story again with Dad.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/reading"
            className="text-xl font-bold text-green-900 underline"
          >
            ← Back to Reading Forest
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ReadingMission