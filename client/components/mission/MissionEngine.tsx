import { type ReactNode, useEffect, useState } from 'react'

import MissionLayout from './MissionLayout'
import MultipleChoiceAnswer from './MultipleChoiceAnswer'
import WritingAnswer from './WritingAnswer'

type SharedMissionProps = {
  missionId: string
  missionNumber: number
  title: string
  instruction: string
  stars: number
  completed: boolean
  mascot: ReactNode
  onComplete: () => void
}

type WritingMissionProps = SharedMissionProps & {
  type: 'writing'
  correctAnswer: string
}

type MultipleChoiceMissionProps = SharedMissionProps & {
  type: 'multiple-choice'
  question: string
  answers: string[]
  correctAnswer: string
}

type MissionEngineProps =
  | WritingMissionProps
  | MultipleChoiceMissionProps

function MissionEngine(props: MissionEngineProps) {
  const {
    missionId,
    missionNumber,
    title,
    instruction,
    stars,
    completed,
    mascot,
    onComplete,
  } = props

  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isCorrect =
    answer.trim().toLowerCase() ===
    props.correctAnswer.trim().toLowerCase()

  useEffect(() => {
    setAnswer('')
    setSubmitted(false)
  }, [missionId])

  function handleAnswerChange(newAnswer: string) {
    setAnswer(newAnswer)

    if (submitted) {
      setSubmitted(false)
    }
  }

  function checkAnswer() {
    if (!answer.trim()) {
      setSubmitted(true)
      return
    }

    setSubmitted(true)

    if (isCorrect && !completed) {
      onComplete()
    }
  }

  function readInstructions() {
    let message = `Hello Zeke. ${instruction}`

    if (props.type === 'writing') {
      message += ` Type this sentence: ${props.correctAnswer}`
    }

    if (props.type === 'multiple-choice') {
      message += ` ${props.question}`
    }

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(message)

    speech.rate = 0.8
    speech.pitch = 1
    speech.volume = 1

    window.speechSynthesis.speak(speech)
  }

  return (
    <MissionLayout
      missionNumber={missionNumber}
      title={title}
      mascot={mascot}
      theme="writing"
      completed={completed}
      backTo="/writing"
      backLabel="Return to Writing World"
    >
      <p className="text-center text-2xl">{instruction}</p>

      <button
        type="button"
        onClick={readInstructions}
        className="mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xl font-bold text-white hover:bg-blue-700"
      >
        🔊 Read Instructions
      </button>

      {props.type === 'writing' && (
        <>
          <p className="mt-8 rounded-2xl bg-purple-50 p-6 text-center text-4xl font-bold">
            {props.correctAnswer}
          </p>

          <WritingAnswer
            answer={answer}
            completed={completed}
            submitted={submitted}
            onAnswerChange={handleAnswerChange}
            onSubmit={checkAnswer}
          />
        </>
      )}

      {props.type === 'multiple-choice' && (
        <>
          <h3 className="mt-8 rounded-2xl bg-blue-50 p-6 text-center text-3xl font-bold text-blue-900">
            {props.question}
          </h3>

          <MultipleChoiceAnswer
            answers={props.answers}
            selectedAnswer={answer}
            completed={completed}
            onSelectAnswer={handleAnswerChange}
            onSubmit={checkAnswer}
          />
        </>
      )}

      {submitted && answer.trim() && (
        <div className="mt-8 text-center">
          {isCorrect ? (
            <>
              <p className="text-5xl">🎉</p>

              <h2 className="mt-4 text-4xl font-bold text-green-700">
                Amazing!
              </h2>

              <p className="mt-4 text-2xl">
                You earned ⭐ {stars} stars and helped the Great Learning Tree
                grow!
              </p>
            </>
          ) : (
            <>
              <p className="text-5xl">😊</p>

              <h2 className="mt-4 text-4xl font-bold text-orange-600">
                Almost!
              </h2>

              <p className="mt-4 text-2xl">
                Check your answer and try again.
              </p>
            </>
          )}
        </div>
      )}
    </MissionLayout>
  )
}

export default MissionEngine