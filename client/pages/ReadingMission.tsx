import { useState } from 'react'
import { Link, useParams } from 'react-router'

import Rex from '../components/characters/Rex'
import MissionLayout from '../components/mission/MissionLayout'
import QuestionCard from '../components/mission/QuestionCard'
import StoryCard from '../components/mission/StoryCard'
import { usePlayer } from '../context/PlayerContext'
import { readingMissions } from '../data/missions'

type MissionStage = 'story' | 'questions' | 'complete'

function ReadingMission() {
  const { missionId } = useParams()
  const { player, addStars, completeMission } = usePlayer()

  const mission = readingMissions.find(
    (readingMission) => readingMission.id === missionId,
  )

  const [stage, setStage] = useState<MissionStage>('story')
  const [currentPage, setCurrentPage] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [starsEarned, setStarsEarned] = useState(0)

  if (!mission) {
    return (
      <main className="min-h-screen bg-green-100 p-8">
        <p className="text-center text-3xl font-bold text-red-700">
          Reading mission not found.
        </p>
      </main>
    )
  }

  const currentMission = mission

  const missionCompleted = player.completedMissions.includes(
    currentMission.id,
  )

  const isLastStoryPage =
    currentPage === currentMission.pages.length - 1

  const isLastQuestion =
    currentQuestion === currentMission.questions.length - 1

  const question = currentMission.questions[currentQuestion]

  function handleAnswer(answer: string) {
    if (selectedAnswer !== null) {
      return
    }

    setSelectedAnswer(answer)

    if (answer === question.correct) {
      setStarsEarned((currentStars) => currentStars + 1)
    }
  }

  function handleNextQuestion() {
    if (isLastQuestion) {
      finishMission()
      return
    }

    setCurrentQuestion((questionNumber) => questionNumber + 1)
    setSelectedAnswer(null)
  }

  function finishMission() {
    setStage('complete')

    if (!missionCompleted) {
      addStars(starsEarned)
      completeMission(currentMission.id)
    }
  }

  function restartMission() {
    setStage('story')
    setCurrentPage(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setStarsEarned(0)
  }

  return (
    <MissionLayout
      missionNumber={currentMission.number}
      title={currentMission.title}
      mascot={
        <Rex
          size="small"
          message="Let's discover where the lost dinosaur egg belongs!"
        />
      }
      theme="reading"
      completed={missionCompleted}
      backTo="/reading"
      backLabel="Return to Reading Forest"
    >
      {stage === 'story' && (
        <div>
          <StoryCard
            text={currentMission.pages[currentPage].text}
            pageNumber={currentPage + 1}
            totalPages={currentMission.pages.length}
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
        <div>
          <p className="mb-4 text-center text-xl font-bold text-green-900">
            Question {currentQuestion + 1} of{' '}
            {currentMission.questions.length}
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
                {isLastQuestion
                  ? 'Finish Mission 🎉'
                  : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      )}

      {stage === 'complete' && (
        <div className="rounded-3xl bg-yellow-100 p-8 text-center shadow md:p-10">
          <Rex
            size="small"
            message="Fantastic reading, Explorer Zeke!"
          />

          <h2 className="mt-5 text-4xl font-bold text-green-900">
            Mission Complete!
          </h2>

          <p className="mt-4 text-2xl">
            Fantastic reading, Explorer Zeke!
          </p>

          <p className="mt-4 text-3xl font-bold">
            You earned {starsEarned} of {currentMission.reward} stars.
          </p>

          {missionCompleted && (
            <p className="mt-4 text-lg font-bold text-green-700">
              This mission is saved as completed.
            </p>
          )}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={restartMission}
              className="rounded-2xl bg-yellow-600 px-8 py-4 text-xl font-bold text-white hover:bg-yellow-700"
            >
              Read Again 📖
            </button>

            <Link
              to="/reading"
              className="rounded-2xl bg-green-700 px-8 py-4 text-xl font-bold text-white hover:bg-green-800"
            >
              Return to Reading Forest
            </Link>
          </div>
        </div>
      )}
    </MissionLayout>
  )
}

export default ReadingMission