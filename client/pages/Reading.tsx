import { Link } from 'react-router'
import Rex from '../components/characters/Rex.tsx'

function Reading() {
  return (
    <section className="min-h-[80vh] rounded-3xl bg-green-100 p-10 shadow-lg">
      <div className="text-center">
        <Rex
  size="medium"
  message="Welcome to Reading Forest, Explorer Zeke! Are you ready for today's mission?"
/>
        <h1 className="mt-4 text-6xl font-bold text-green-900">
          Reading Forest
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-2xl">
          Welcome back, Explorer Zeke. The forest needs your help to find the
          lost dinosaur egg.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-8 text-center shadow">
        <p className="text-5xl">🦖🥚</p>

        <h2 className="mt-4 text-4xl font-bold">Mission 1</h2>

        <p className="mt-2 text-3xl font-semibold text-green-800">
          The Lost Dinosaur Egg
        </p>

        <p className="mt-4 text-xl">
          Read a short story with Dad, answer 3 questions, and earn your first
          Reading Forest stars.
        </p>

        <div className="mt-6 flex justify-center gap-4 text-xl">
          <span className="rounded-full bg-green-200 px-4 py-2">
            Difficulty: ⭐
          </span>
          <span className="rounded-full bg-yellow-200 px-4 py-2">
            Reward: ⭐⭐⭐
          </span>
        </div>

      <Link
          to="/reading/mission-1"
          className="mt-8 inline-block rounded-2xl bg-green-700 px-10 py-5 text-2xl font-bold text-white hover:bg-green-800"
           >
  Start Reading Mission
</Link>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-xl font-bold text-green-900 underline">
          ← Back to Academy Home
        </Link>
      </div>
    </section>
  )
}

export default Reading