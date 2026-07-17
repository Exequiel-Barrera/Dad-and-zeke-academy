import PandaloloImage from '../../assets/images/Pandalolo.png'
type PandaloloProps = {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

function Pandalolo({
  message,
  size = 'medium',
}: PandaloloProps) {
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-40',
    large: 'w-64',
  }

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={PandaloloImage}
        alt="Pandalolo the Story Panda"
        className={`${sizeClasses[size]} rounded-3xl object-contain`}
      />

      {message && (
  <div className="mt-4 flex max-w-xl items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-lg">

    <p className="flex-1 text-xl">
      {message}
    </p>

    <button
      type="button"
      onClick={() => {
        window.speechSynthesis.cancel()

        const speech = new SpeechSynthesisUtterance(message)

        speech.rate = 0.85
        speech.pitch = 1

        window.speechSynthesis.speak(speech)
      }}
      className="rounded-full bg-purple-600 p-3 text-2xl text-white transition hover:scale-110 hover:bg-purple-700"
      title="Hear Pandalolo"
    >
      🔊
    </button>

  </div>
)}
    </div>
  )
}

export default Pandalolo