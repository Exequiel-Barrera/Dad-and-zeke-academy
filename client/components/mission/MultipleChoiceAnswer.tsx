type MultipleChoiceAnswerProps = {
  answers: string[]
  selectedAnswer: string
  completed: boolean
  onSelectAnswer: (answer: string) => void
  onSubmit: () => void
}

function MultipleChoiceAnswer({
  answers,
  selectedAnswer,
  completed,
  onSelectAnswer,
  onSubmit,
}: MultipleChoiceAnswerProps) {
  return (
    <>
      <div className="mt-8 grid gap-4">
        {answers.map((answer) => {
          const selected = selectedAnswer === answer

          return (
            <button
              key={answer}
              type="button"
              disabled={completed}
              onClick={() => onSelectAnswer(answer)}
              className={`rounded-2xl border-2 p-5 text-left text-xl font-bold ${
                selected
                  ? 'border-blue-600 bg-blue-100 text-blue-900'
                  : 'border-gray-300 bg-white hover:bg-gray-100'
              } ${
                completed
                  ? 'cursor-not-allowed opacity-70'
                  : 'cursor-pointer'
              }`}
            >
              {answer}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={completed}
        className={`mt-8 w-full rounded-2xl py-5 text-2xl font-bold text-white ${
          completed
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        {completed ? 'Mission Completed ✅' : 'Check My Answer'}
      </button>
    </>
  )
}

export default MultipleChoiceAnswer