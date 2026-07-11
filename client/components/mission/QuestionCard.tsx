type QuestionCardProps = {
  question: string
  answers: string[]
  correctAnswer: string
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
}

function QuestionCard({
  question,
  answers,
  correctAnswer,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const isCorrect = selectedAnswer === correctAnswer

  return (
    <article className="rounded-3xl bg-green-50 p-8 shadow">
      <p className="text-center text-6xl">🦉❓</p>

      <h2 className="mt-5 text-center text-3xl font-bold text-green-900">
        {question}
      </h2>

      <div className="mt-8 grid gap-4">
        {answers.map((answer) => {
          const answerWasSelected = selectedAnswer === answer

          return (
            <button
              key={answer}
              type="button"
              disabled={selectedAnswer !== null}
              onClick={() => onSelectAnswer(answer)}
              className={`rounded-2xl p-5 text-2xl font-bold shadow transition
                ${
                  answerWasSelected && answer === correctAnswer
                    ? 'bg-green-300'
                    : ''
                }
                ${
                  answerWasSelected && answer !== correctAnswer
                    ? 'bg-orange-200'
                    : ''
                }
                ${
                  !answerWasSelected
                    ? 'bg-white hover:scale-[1.02] hover:bg-green-200'
                    : ''
                }
                disabled:cursor-default
              `}
            >
              {answer}
            </button>
          )
        })}
      </div>

      {selectedAnswer && (
        <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow">
          {isCorrect ? (
            <>
              <p className="text-5xl">🎉</p>
              <p className="mt-3 text-2xl font-bold text-green-800">
                Excellent work, Explorer!
              </p>
            </>
          ) : (
            <>
              <p className="text-5xl">🦖</p>
              <p className="mt-3 text-2xl font-bold text-orange-700">
                Great try! The correct answer is: {correctAnswer}
              </p>
            </>
          )}
        </div>
      )}
    </article>
  )
}

export default QuestionCard