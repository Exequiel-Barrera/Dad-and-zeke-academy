import { useState } from 'react'
import { Link } from 'react-router'

import QuestionCard from '../components/mission/QuestionCard.tsx'
import StoryCard from '../components/mission/StoryCard.tsx'
import { missions } from '../data/missions.ts'
import Rex from '../components/characters/Rex.tsx'
type MissionStage = 'story' | 'questions' | 'complete'

function ReadingMission() {
  const mission = missions[0]

  const [stage, setStage] = useState<MissionStage>('story')
  const [currentPage, setCurrentPage] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [starsEarned, setStarsEarned] = useState(0)

  const isLastStoryPage = currentPage === mission.pages.length - 1
  const isLastQuestion = currentQuestion === mission.questions.length - 1

  const question = mission.questions[currentQuestion]

  function handleAnswer(answer: string) {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)

    if (answer === question.correct) {
      setStarsEarned((currentStars) => currentStars + 1)
    }
  }

  function handleNextQuestion() {
    if (isLastQuestion) {
      setStage('complete')
      return
    }

    setCurrentQuestion((questionNumber) => questionNumber + 1)
    setSelectedAnswer(null)
  }

  return (
    <section className="min-h-[80vh] rounded-3xl bg-green-100 p-6 shadow-lg md:p-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow md:p-10">
        <header className="text-center">
          <Rex
  size="small"
  message="Let's discover where the lost dinosaur egg belongs!"
/>
          <h1 className="mt-4 text-4xl font-bold text-green-900 md:text-5xl">
            Mission 1: {mission.title}
          </h1>
        </header>

        {stage === 'story' && (
          <div className="mt-8">
            <StoryCard
              text={mission.pages[currentPage].text}
              pageNumber={currentPage + 1}
              totalPages={mission.pages.length}
            />

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() =>
                  setCurrentPage((pageNumber) => pageNumber - 1)
                }
                className="rounded-xl bg-gray-300 px-6 py-3 text-lg font-bold disabled:opacity-40"
              >
                ← Previous
              </button>

              {!isLastStoryPage ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((pageNumber) => pageNumber + 1)
                  }
                  className="rounded-xl bg-green-700 px-6 py-3 text-lg font-bold text-white hover:bg-green-800"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStage('questions')}
                  className="rounded-xl bg-green-700 px-6 py-3 text-lg font-bold text-white hover:bg-green-800"
                >
                  Answer Rex&apos;s Questions →
                </button>
              )}
            </div>
          </div>
        )}

        {stage === 'questions' && (
          <div className="mt-8">
            <p className="mb-4 text-center text-xl font-bold text-green-900">
              Question {currentQuestion + 1} of {mission.questions.length}
            </p>

            <QuestionCard
              question={question.question}
              answers={question.answers}
              correctAnswer={question.correct}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleAnswer}
            />

            {selectedAnswer && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="rounded-xl bg-green-700 px-8 py-4 text-xl font-bold text-white hover:bg-green-800"
                >
                  {isLastQuestion ? 'Finish Mission 🎉' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        )}

        {stage === 'complete' && (
          <div className="mt-10 rounded-3xl bg-yellow-100 p-10 text-center shadow">
            <Rex
  size="small"
  message="Let's discover where the lost dinosaur egg belongs!"
/>
            <h2 className="mt-5 text-4xl font-bold text-green-900">
              Mission Complete!
            </h2>

            <p className="mt-4 text-2xl">
              Fantastic reading, Explorer Zeke!
            </p>

            <p className="mt-4 text-3xl font-bold">
              You earned {starsEarned} of {mission.reward} stars.
            </p>

            <Link
              to="/reading"
              className="mt-8 inline-block rounded-2xl bg-green-700 px-8 py-4 text-xl font-bold text-white hover:bg-green-800"
            >
              Return to Reading Forest
            </Link>
          </div>
        )}

        {stage !== 'complete' && (
          <div className="mt-10 text-center">
            <Link
              to="/reading"
              className="text-lg font-bold text-green-900 underline"
            >
              ← Leave mission and return to Reading Forest
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReadingMission