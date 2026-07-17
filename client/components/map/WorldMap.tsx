import { Link } from 'react-router'

type WorldLocation = {
  name: string
  guide: string
  emoji: string
  path: string
  description: string
  background: string
  unlocked: boolean
}

const locations: WorldLocation[] = [
  {
    name: 'Reading Forest',
    guide: 'Rex',
    emoji: '🌲',
    path: '/reading',
    description: 'Explore stories, words and reading adventures.',
    background: 'bg-green-100',
    unlocked: true,
  },
  {
    name: "Writer's Workshop",
    guide: 'Pandalolo',
    emoji: '🐼',
    path: '/writing',
    description: 'Build words, sentences and wonderful stories.',
    background: 'bg-purple-100',
    unlocked: true,
  },
  {
    name: 'Maths Mountain',
    guide: 'Finn',
    emoji: '⛰️',
    path: '/maths',
    description: 'Solve number puzzles and climb the mountain.',
    background: 'bg-blue-100',
    unlocked: true,
  },
  {
    name: 'Discovery Lab',
    guide: 'Bolt',
    emoji: '🤖',
    path: '/discovery',
    description: 'Experiment, investigate and discover new things.',
    background: 'bg-cyan-100',
    unlocked: true,
  },
  {
    name: 'Kindness Kingdom',
    guide: 'Leo',
    emoji: '🦁',
    path: '/character',
    description: 'Grow confidence, kindness and persistence.',
    background: 'bg-orange-100',
    unlocked: true,
  },
  {
    name: 'Hall of Fame',
    guide: 'Your achievements',
    emoji: '🏆',
    path: '/rewards',
    description: 'See stars, badges and completed adventures.',
    background: 'bg-yellow-100',
    unlocked: true,
  },
]

function WorldMap() {
  return (
    <section aria-labelledby="world-map-heading">
      <div className="text-center">
        <h2
          id="world-map-heading"
          className="text-4xl font-bold text-blue-900"
        >
          Adventure World
        </h2>

        <p className="mt-2 text-xl">
          Choose where you would like to explore today.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {locations.map((location) =>
          location.unlocked ? (
            <Link
              key={location.name}
              to={location.path}
              className={`${location.background} rounded-3xl border-4 border-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-center gap-5">
                <span className="text-6xl" aria-hidden="true">
                  {location.emoji}
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-blue-900">
                    {location.name}
                  </h3>

                  <p className="mt-1 font-semibold">
                    with {location.guide}
                  </p>

                  <p className="mt-3 text-lg">
                    {location.description}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={location.name}
              className="rounded-3xl bg-gray-200 p-6 opacity-60 shadow"
            >
              <p className="text-2xl font-bold">🔒 {location.name}</p>
              <p className="mt-2">Keep learning to unlock this world.</p>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

export default WorldMap