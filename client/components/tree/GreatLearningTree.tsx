type GreatLearningTreeProps = {
  stars: number
}

function GreatLearningTree({ stars }: GreatLearningTreeProps) {
  let stage = '🌱'
  let message = 'A tiny seed of learning.'

  if (stars >= 10) {
    stage = '🌿'
    message = 'Your learning is growing!'
  }

  if (stars >= 25) {
    stage = '🌳'
    message = 'The tree is becoming strong.'
  }

  if (stars >= 50) {
    stage = '🌳✨'
    message = 'Magic fills the branches!'
  }

  if (stars >= 100) {
    stage = '🌳🌟'
    message = 'The Great Learning Tree shines brightly!'
  }

  return (
    <section className="rounded-3xl bg-green-50 p-10 text-center shadow-xl">

      <h2 className="text-4xl font-bold text-green-900">
        The Great Learning Tree
      </h2>

      <p className="mt-8 text-8xl">
        {stage}
      </p>

      <p className="mt-6 text-2xl">
        {message}
      </p>

      <p className="mt-8 text-xl font-bold">
        ⭐ {stars} Learning Stars
      </p>

    </section>
  )
}

export default GreatLearningTree