type WritingAnswerProps = {
  answer: string
  completed: boolean
  submitted: boolean
  onAnswerChange: (answer: string) => void
  onSubmit: () => void
}

function WritingAnswer({
  answer,
  completed,
  submitted,
  onAnswerChange,
  onSubmit,
}: WritingAnswerProps) {
  return (
    <>
      <input
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
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
        onClick={onSubmit}
        disabled={completed}
        className={`mt-8 w-full rounded-2xl py-5 text-2xl font-bold text-white ${
          completed
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-purple-700 hover:bg-purple-800'
        }`}
      >
        {completed ? 'Mission Completed ✅' : 'Check My Sentence'}
      </button>

      {submitted && answer.length === 0 && (
        <p className="mt-4 text-center text-lg font-bold text-orange-600">
          Type your sentence before checking it.
        </p>
      )}
    </>
  )
}

export default WritingAnswer