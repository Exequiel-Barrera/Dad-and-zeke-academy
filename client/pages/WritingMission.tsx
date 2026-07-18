import { useState } from 'react'
import Pandalolo from '../components/characters/Pandalolo'
import { usePlayer } from '../context/PlayerContext'
import { writingMissions } from '../data/missions'

function WritingMission() {
  const { player, addStars, completeMission } = usePlayer()
  const mission = writingMissions[0]
  const missionCompleted =
  player.completedMissions.includes('writing-1')
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [rewardGiven, setRewardGiven] = useState(false)
  const correctSentence = mission.sentence

  const isCorrect =
    answer.trim().toLowerCase() === correctSentence.toLowerCase()

  function checkAnswer() {
  setSubmitted(true)

  if (isCorrect && !rewardGiven) {
    addStars(mission.stars)
    completeMission(mission.id)
    setRewardGiven(true)
  }
}

  return (
    <main className="min-h-screen bg-purple-100 p-8">
      <div className="mx-auto max-w-4xl">

        <Pandalolo
          size="medium"
          message="Let's build your very first super sentence!"
        />

        <section className="mt-10 rounded-3xl bg-white p-10 shadow-xl">

          <h1 className="text-center text-5xl font-bold text-purple-900">
          ✏️ {mission.title}
          </h1>

          <p className="mt-6 text-center text-2xl">
          {mission.instruction}
          </p>
           <button
             type="button"
              onClick={readInstructions}
               className="mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xl font-bold text-white hover:bg-blue-700"
             >
               🔊 Read Instructions
          </button>
          <p className="mt-8 rounded-2xl bg-purple-50 p-6 text-center text-4xl font-bold">
            {mission.sentence}
          </p>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-10 w-full rounded-2xl border-2 border-purple-300 p-5 text-2xl"
            placeholder="Type your sentence here..."
          />

      <button
  type="button"
  onClick={checkAnswer}
  disabled={missionCompleted}
  className={`mt-8 w-full rounded-2xl py-5 text-2xl font-bold text-white ${
    missionCompleted
      ? 'cursor-not-allowed bg-gray-400'
      : 'bg-purple-700 hover:bg-purple-800'
  }`}
>
  {missionCompleted ? 'Mission Completed ✅' : 'Check My Sentence'}
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
                    You earned ⭐ 3 Stars and helped the Great Learning Tree grow!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-5xl">😊</p>

                  <h2 className="mt-4 text-4xl font-bold text-orange-600">
                    Almost!
                  </h2>

                  <p className="mt-4 text-2xl">
                    Check your capital letter, spaces and full stop, then try again.
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
function readInstructions() {
  const instructions =
    'Hello Zeke. Type this sentence exactly: The dinosaur is green. Remember to use a capital letter, spaces between words, and a full stop.'

  window.speechSynthesis.cancel()

  const speech = new SpeechSynthesisUtterance(instructions)

  speech.rate = 0.8
  speech.pitch = 1
  speech.volume = 1

  window.speechSynthesis.speak(speech)
}
function readPandaloloMessage() {
  const speech = new SpeechSynthesisUtterance(
    "Hello Explorer Zeke! I'm Pandalolo. Today we're going to create an amazing story together!",
  )

  speech.rate = 0.8
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(speech)
}
export default WritingMission