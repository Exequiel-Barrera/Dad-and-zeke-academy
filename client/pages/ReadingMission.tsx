import { Link } from 'react-router'

function ReadingMission() {
  return (
    <section className="min-h-[80vh] rounded-3xl bg-green-100 p-10 shadow-lg">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow">
        <p className="text-center text-6xl">🦖🥚🌲</p>

        <h1 className="mt-4 text-center text-5xl font-bold text-green-900">
          Mission 1: The Lost Dinosaur Egg
        </h1>

        <p className="mt-6 text-2xl leading-relaxed">
          Rex the little dinosaur was walking through Reading Forest when he
          found a shiny egg under a big green tree.
        </p>

        <p className="mt-4 text-2xl leading-relaxed">
          “Oh no!” said Rex. “This egg is lost. I need an explorer to help me
          find where it belongs.”
        </p>

        <p className="mt-4 text-2xl leading-relaxed">
          Rex looked at Zeke and smiled. “Can you help me read the clues?”
        </p>

        <div className="mt-8 rounded-2xl bg-green-50 p-6">
          <h2 className="text-3xl font-bold text-green-900">
            Question 1
          </h2>

          <p className="mt-4 text-2xl">
            What did Rex find in Reading Forest?
          </p>

          <div className="mt-6 grid gap-4">
            <button className="rounded-2xl bg-white p-4 text-2xl font-bold shadow hover:bg-green-200">
              A shiny egg
            </button>

            <button className="rounded-2xl bg-white p-4 text-2xl font-bold shadow hover:bg-green-200">
              A red car
            </button>

            <button className="rounded-2xl bg-white p-4 text-2xl font-bold shadow hover:bg-green-200">
              A blue hat
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/reading"
            className="text-xl font-bold text-green-900 underline"
          >
            ← Back to Reading Forest
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ReadingMission