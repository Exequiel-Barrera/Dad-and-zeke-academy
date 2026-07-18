import { useEffect, useState } from 'react'

type MissionEngineProps = {
  missionId: string
  missionNumber: number
  title: string
  instruction: string
  correctAnswer: string
  stars: number
  completed: boolean
  mascot: React.ReactNode
  onComplete: () => void
}

function MissionEngine({
  missionId,
  missionNumber,
  title,
  instruction,
  correctAnswer,
  stars,
  completed,
  mascot,
  onComplete,
}: MissionEngineProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isCorrect =
    answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()

  useEffect(() => {
    setAnswer('')
    setSubmitted(false)
  }, [missionId])

  function checkAnswer() {
    setSubmitted(true)

    if (isCorrect && !completed) {
      onComplete()
    }
  }

  function readInstructions() {
    const message = `Hello Zeke. ${instruction} ${correctAnswer} Remember to use a capital letter, spaces between words, and a full stop.`

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(message)

    speech.rate = 0.8
    speech.pitch = 1
    speech.volume = 1

    window.speechSynthesis.speak(speech)
  }

  return (
    <main className="min-h-screen bg-purple-100 p-8">
      <div className="mx-auto max-w-4xl">
        {mascot}

        <section className="mt-10 rounded-3xl bg-white p-10 shadow-xl">
          <h1 className="text-center text-5xl font-bold text-purple-900">
            ✏️ Mission {missionNumber}
          </h1>

          <h2 className="mt-4 text-center text-3xl font-bold text-purple-700">
            {title}
          </h2>

          {completed && (
            <div className="mt-6 rounded-2xl bg-green-100 p-4 text-center text-xl font-bold text-green-700">
              ✅ This mission has already been completed.
            </div>
          )}

          <p className="mt-6 text-center text-2xl">{instruction}</p>

          <button
            type="button"
            onClick={readInstructions}
            className="mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xl font-bold text-white hover:bg-blue-700"
          >
            🔊 Read Instructions
          </button>

          <p className="mt-8 rounded-2xl bg-purple-50 p-6 text-center text-4xl font-bold">
            {correctAnswer}
          </p>

          <input
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value)

              if (submitted) {
                setSubmitted(false)
              }
            }}
            disabled={completed}
            className={`mt-10 w-full rounded-2xl border-2 p-5 text-2xl ${
              completed
                ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
                : 'border-purple-300 bg-white'
            }`}
            placeholder={
              completed
                ? 'Mission already completed'
                : 'Type your sentence here...'
            }
          />

          <button
            type="button"
            onClick={checkAnswer}
            disabled={completed}
            className={`mt-8 w-full rounded-2xl py-5 text-2xl font-bold text-white ${
              completed
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-purple-700 hover:bg-purple-800'
            }`}
          >
            {completed ? 'Mission Completed ✅' : 'Check My Sentence'}
          </button>

          {submitted && (
            <div className="mt-8 text-center">
              {isCorrect ? (
                <>
                  <p className="text-5xl">🎉</p>

                  <h2 className="mt-4 text-4xl font-bold text-green-700">
                    Amazing!
                  </h2>

                  <p className="mt-4 text-2xl">
                    You earned ⭐ {stars} Stars and helped the Great Learning
                    Tree grow!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-5xl">😊</p>

                  <h2 className="mt-4 text-4xl font-bold text-orange-600">
                    Almost!
                  </h2>

                  <p className="mt-4 text-2xl">
                    Check your capital letter, spaces and full stop, then try
                    again.
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default MissionEngine