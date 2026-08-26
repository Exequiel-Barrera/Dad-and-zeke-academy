import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import Rex from '../components/characters/Rex'
import MissionLayout from '../components/mission/MissionLayout'
import QuestionCard from '../components/mission/QuestionCard'
import StoryCard from '../components/mission/StoryCard'
import { usePlayer } from '../context/PlayerContext'
import { readingMissions } from '../data/missions'

type MissionStage =
  | 'story'
  | 'questions'
  | 'complete'

function ReadingMission() {
  const { missionId } = useParams()

const {
  player,
  addStars,
  completeMission,
  recordReadingResult,
} = usePlayer()

  const missionIndex =
    readingMissions.findIndex(
      (readingMission) =>
        readingMission.id === missionId,
    )

  const mission =
    missionIndex >= 0
      ? readingMissions[missionIndex]
      : undefined

  const nextMission =
    readingMissions[missionIndex + 1]

  const [stage, setStage] =
    useState<MissionStage>('story')

  const [currentPage, setCurrentPage] =
    useState(0)

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0)

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<string | null>(null)

  const [
    starsEarned,
    setStarsEarned,
  ] = useState(0)

  const [
    wasAlreadyCompleted,
    setWasAlreadyCompleted,
  ] = useState(false)

  useEffect(() => {
    setStage('story')
    setCurrentPage(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setStarsEarned(0)

    window.speechSynthesis.cancel()

    if (missionId) {
      setWasAlreadyCompleted(
        player.completedMissions.includes(
          missionId,
        ),
      )
    }
  }, [missionId])

  if (!mission) {
    return (
      <main className="min-h-screen bg-green-100 p-8">
        <p className="text-center text-3xl font-bold text-red-700">
          Reading mission not found.
        </p>

        <div className="mt-8 text-center">
          <Link
            to="/reading"
            className="rounded-2xl bg-green-700 px-8 py-4 text-xl font-bold text-white"
          >
            Return to Reading Forest
          </Link>
        </div>
      </main>
    )
  }

  const currentMission = mission

  const missionCompleted =
    player.completedMissions.includes(
      currentMission.id,
    )

  const isLastStoryPage =
    currentPage ===
    currentMission.pages.length - 1

  const isLastQuestion =
    currentQuestion ===
    currentMission.questions.length - 1

  const question =
    currentMission.questions[
      currentQuestion
    ]

  const rexMissionMessage =
    currentMission.id === 'reading-1'
      ? "Let's find out who the lost dinosaur egg belongs to!"
      : currentMission.id === 'reading-2'
        ? "Look, Zeke! Tiny footprints! Let's follow them and see where they lead!"
        : currentMission.id === 'reading-3'
          ? "Oh no! The river bridge is broken. Let's help our dinosaur friends!"
          : `Let's begin ${currentMission.title}!`

  const rexCompleteMessage =
    currentMission.id === 'reading-1'
      ? 'Great detective work, Zeke! We found a clue!'
      : currentMission.id === 'reading-2'
        ? 'We found the Triceratops! The egg belongs to her family!'
        : currentMission.id === 'reading-3'
          ? 'We did it! The egg is safely back with its dinosaur family!'
          : 'Fantastic reading, Explorer Zeke!'

  function handleAnswer(
    answer: string,
  ) {
    if (selectedAnswer !== null) {
      return
    }

    setSelectedAnswer(answer)

    if (answer === question.correct) {
      setStarsEarned(
        (currentStars) =>
          currentStars + 1,
      )
    }
  }

  function handleNextQuestion() {
    if (isLastQuestion) {
      finishMission()
      return
    }

    setCurrentQuestion(
      (questionNumber) =>
        questionNumber + 1,
    )

    setSelectedAnswer(null)
  }
function finishMission() {
  setStage('complete')

  window.speechSynthesis.cancel()

  if (!missionCompleted) {
    addStars(starsEarned)

    recordReadingResult(
      starsEarned,
      currentMission.questions.length,
    )

    completeMission(
      currentMission.id,
    )
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function restartMission() {
  setStage('story')
  setCurrentPage(0)
  setCurrentQuestion(0)
  setSelectedAnswer(null)
  setStarsEarned(0)

  window.speechSynthesis.cancel()

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
  
  function getPreferredVoice():
    | SpeechSynthesisVoice
    | undefined {
    const voices =
      window.speechSynthesis.getVoices()

    return (
      voices.find((voice) =>
        voice.name.includes(
          'Microsoft Aria',
        ),
      ) ||
      voices.find((voice) =>
        voice.name.includes(
          'Microsoft Jenny',
        ),
      ) ||
      voices.find((voice) =>
        voice.name.includes(
          'Google UK English Female',
        ),
      ) ||
      voices.find(
        (voice) =>
          voice.lang === 'en-NZ',
      ) ||
      voices.find(
        (voice) =>
          voice.lang === 'en-AU',
      ) ||
      voices.find((voice) =>
        voice.lang.startsWith('en'),
      )
    )
  }

  function speak(text: string) {
    window.speechSynthesis.cancel()

    const speech =
      new SpeechSynthesisUtterance(
        text,
      )

    const preferredVoice =
      getPreferredVoice()

    if (preferredVoice) {
      speech.voice = preferredVoice
    }

    speech.rate = 0.88
    speech.pitch = 1.05
    speech.volume = 1

    window.speechSynthesis.speak(
      speech,
    )
  }

  function readStoryPage() {
    const page =
      currentMission.pages[
        currentPage
      ]

    speak(page.text)
  }

  function readQuestion() {
    const answers =
      question.answers

    let spokenAnswers =
      answers.join(', ')

    if (answers.length === 3) {
      spokenAnswers =
        `${answers[0]}... ${answers[1]}... or ${answers[2]}?`
    }

    speak(
      `${question.question} Was it ${spokenAnswers}`,
    )
  }

  function readCelebrationMessage() {
    let message =
      `${rexCompleteMessage} You completed ${currentMission.title}.`

    if (!wasAlreadyCompleted) {
      message +=
        ` You earned ${starsEarned} stars.`
    }

    if (
      nextMission &&
      !wasAlreadyCompleted
    ) {
      message +=
        ` A new reading mission has been unlocked. Next is Mission ${nextMission.number}: ${nextMission.title}.`
    }

    if (!nextMission) {
      message +=
        ' You completed every adventure in Reading Forest.'
    }

    speak(message)
  }

  return (
    <MissionLayout
      missionNumber={
        currentMission.number
      }
      title={currentMission.title}
      mascot={
        <Rex
          size="small"
          message={
            stage === 'complete'
              ? rexCompleteMessage
              : rexMissionMessage
          }
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
            text={
              currentMission.pages[
                currentPage
              ].text
            }
            pageNumber={
              currentPage + 1
            }
            totalPages={
              currentMission.pages
                .length
            }
          />

          <button
            type="button"
            onClick={readStoryPage}
            className="mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-blue-700"
          >
            🔊 Hear Rex Read This Page
          </button>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={
                currentPage === 0
              }
              onClick={() => {
                window.speechSynthesis.cancel()

                setCurrentPage(
                  (pageNumber) =>
                    pageNumber - 1,
                )
              }}
              className="rounded-xl bg-gray-300 px-6 py-3 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            {!isLastStoryPage ? (
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis.cancel()

                  setCurrentPage(
                    (pageNumber) =>
                      pageNumber + 1,
                  )
                }}
                className="rounded-xl bg-green-700 px-6 py-3 text-lg font-bold text-white transition hover:scale-105 hover:bg-green-800"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis.cancel()
                  setStage(
                    'questions',
                  )
                }}
                className="rounded-xl bg-green-700 px-6 py-3 text-lg font-bold text-white transition hover:scale-105 hover:bg-green-800"
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
            Question{' '}
            {currentQuestion + 1} of{' '}
            {
              currentMission
                .questions.length
            }
          </p>

          <div className="mb-6 h-3 overflow-hidden rounded-full bg-green-100">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestion +
                    1) /
                    currentMission
                      .questions
                      .length) *
                  100
                }%`,
              }}
            />
          </div>

          <button
            type="button"
            onClick={readQuestion}
            className="mx-auto mb-6 flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-blue-700"
          >
            🔊 Read Question
          </button>

          <QuestionCard
            question={
              question.question
            }
            answers={
              question.answers
            }
            correctAnswer={
              question.correct
            }
            selectedAnswer={
              selectedAnswer
            }
            onSelectAnswer={
              handleAnswer
            }
          />

          {selectedAnswer && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis.cancel()
                  handleNextQuestion()
                }}
                className="rounded-xl bg-green-700 px-8 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-green-800"
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
        <div className="relative overflow-hidden rounded-3xl border-4 border-yellow-400 bg-yellow-100 p-8 text-center shadow-lg md:p-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute left-[8%] top-[8%] animate-bounce text-4xl">
              ⭐
            </span>

            <span className="absolute right-[10%] top-[12%] animate-pulse text-4xl">
              🎉
            </span>

            <span className="absolute bottom-[12%] left-[12%] animate-pulse text-3xl">
              ✨
            </span>

            <span className="absolute bottom-[10%] right-[10%] animate-bounce text-4xl">
              ⭐
            </span>
          </div>

          <div className="relative z-10">
            <p className="animate-bounce text-7xl">
              🏆
            </p>

            <p className="mt-4 text-3xl">
              🎉 ⭐ 🎉 ⭐ 🎉
            </p>

            <h2 className="mt-5 text-4xl font-bold text-green-900 md:text-5xl">
              Mission Complete!
            </h2>

            <p className="mt-4 text-2xl font-bold">
              {rexCompleteMessage}
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-3xl bg-white p-6 shadow">
              {wasAlreadyCompleted ? (
                <>
                  <p className="text-5xl">
                    📖
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-green-800">
                    Great Reading Practice!
                  </h3>

                  <p className="mt-3 text-lg">
                    You completed this
                    mission again.
                  </p>

                  <p className="mt-2 font-bold text-green-700">
                    Your original reward
                    is already saved.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-green-900">
                    Stars earned
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {Array.from({
                      length:
                        currentMission.reward,
                    }).map(
                      (_, index) => (
                        <span
                          key={index}
                          className={`text-5xl ${
                            index <
                            starsEarned
                              ? 'animate-bounce'
                              : 'grayscale opacity-30'
                          }`}
                          style={{
                            animationDelay: `${index * 150}ms`,
                          }}
                        >
                          ⭐
                        </span>
                      ),
                    )}
                  </div>

                  <p className="mt-4 text-3xl font-bold">
                    {starsEarned} of{' '}
                    {
                      currentMission.reward
                    }
                  </p>

                  <p className="mt-3 text-lg font-bold text-green-700">
                    The Great Learning
                    Tree grew!
                  </p>
                </>
              )}
            </div>

            {!wasAlreadyCompleted &&
              nextMission && (
                <div className="mx-auto mt-8 max-w-lg rounded-3xl border-4 border-purple-400 bg-purple-100 p-6 shadow">
                  <p className="animate-pulse text-6xl">
                    🔓
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-purple-900">
                    New Mission Unlocked!
                  </h3>

                  <p className="mt-3 text-xl font-bold">
                    Mission{' '}
                    {
                      nextMission.number
                    }
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {nextMission.title}
                  </p>

                  <p className="mt-4 text-lg">
                    Rex has discovered
                    the next part of the
                    forest path.
                  </p>
                </div>
              )}

            {!nextMission && (
              <div className="mx-auto mt-8 max-w-lg rounded-3xl border-4 border-green-600 bg-green-200 p-6 shadow">
                <p className="animate-bounce text-7xl">
                  🌳🏆🌳
                </p>

                <h3 className="mt-4 text-3xl font-bold text-green-900">
                  Reading Forest
                  Complete!
                </h3>

                <p className="mt-3 text-xl font-bold">
                  You completed every
                  Reading Forest
                  adventure!
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={
                readCelebrationMessage
              }
              className="mt-8 rounded-2xl bg-blue-600 px-6 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-blue-700"
            >
              🔊 Hear Rex&apos;s Message
            </button>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={restartMission}
                className="rounded-2xl bg-yellow-600 px-8 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-yellow-700"
              >
                Read Again 📖
              </button>

              <Link
                to="/reading"
                className="rounded-2xl bg-green-700 px-8 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-green-800"
              >
                View Reading Forest 🌳
              </Link>

              {nextMission && (
                <Link
                  to={`/reading/mission/${nextMission.id}`}
                  className="rounded-2xl bg-purple-700 px-8 py-4 text-xl font-bold text-white transition hover:scale-105 hover:bg-purple-800"
                >
                  Start Next Adventure →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </MissionLayout>
  )
}

export default ReadingMission