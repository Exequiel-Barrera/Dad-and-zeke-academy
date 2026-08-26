import { Link } from 'react-router'

import { usePlayer } from '../context/PlayerContext'

function formatDifficulty(
  difficulty: string,
) {
  return difficulty
    .split('-')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(' ')
}

function DadDashboard() {
  const {
    player,
    learningProfile,
  } = usePlayer()

  const accuracyPercent = Math.round(
    learningProfile.averageAccuracy * 100,
  )

  const suggestedFocus =
    learningProfile.currentDifficulty ===
    'beginner'
      ? [
          'Reading comprehension',
          'Simple vocabulary',
          'Short story recall',
        ]
      : learningProfile.currentDifficulty ===
          'easy'
        ? [
            'Reading comprehension',
            'Sequencing',
            'Vocabulary',
          ]
        : learningProfile.currentDifficulty ===
            'easy-plus'
          ? [
              'Sequencing',
              'Simple inference',
              'Reading comprehension',
            ]
          : [
              'Inference',
              'Independent reading',
              'Vocabulary in context',
            ]

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-lg md:p-10">
          <p className="text-lg font-bold text-blue-300">
            Parent View
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Dad Dashboard
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Track reading progress, current
            difficulty, and what the adaptive
            learning system recommends next.
          </p>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon="📚"
            label="Reading Missions"
            value={
              learningProfile
                .completedReadingMissions
            }
          />

          <DashboardCard
            icon="🎯"
            label="Average Accuracy"
            value={`${accuracyPercent}%`}
          />

          <DashboardCard
            icon="🧠"
            label="Current Difficulty"
            value={formatDifficulty(
              learningProfile.currentDifficulty,
            )}
          />

          <DashboardCard
            icon="⭐"
            label="Total Stars"
            value={player.stars}
          />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-md">
            <p className="text-5xl">
              📈
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-900">
              Learning Profile
            </h2>

            <div className="mt-6 space-y-4 text-lg">
              <ProfileRow
                label="Age"
                value={`${learningProfile.age}`}
              />

              <ProfileRow
                label="Reading Level"
                value={`${learningProfile.readingLevel}`}
              />

              <ProfileRow
                label="Reading Missions Completed"
                value={`${learningProfile.completedReadingMissions}`}
              />

              <ProfileRow
                label="Average Accuracy"
                value={`${accuracyPercent}%`}
              />

              <ProfileRow
                label="Adaptive Difficulty"
                value={formatDifficulty(
                  learningProfile.currentDifficulty,
                )}
              />
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-md">
            <p className="text-5xl">
              🧭
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-900">
              Current Learning Focus
            </h2>

            <p className="mt-3 text-lg text-slate-600">
              Based on the current adaptive
              difficulty, the next reading
              activities should focus on:
            </p>

            <div className="mt-6 space-y-3">
              {suggestedFocus.map(
                (focus) => (
                  <div
                    key={focus}
                    className="flex items-center gap-3 rounded-2xl bg-blue-50 px-5 py-4"
                  >
                    <span className="text-2xl">
                      ✅
                    </span>

                    <span className="text-lg font-bold text-blue-950">
                      {focus}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border-4 border-green-300 bg-green-50 p-8 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-5xl">
                🤖
              </p>

              <h2 className="mt-3 text-3xl font-black text-green-950">
                Suggested Next Mission
              </h2>

              <p className="mt-3 text-lg text-green-900">
                Generate a{' '}
                <strong>
                  {formatDifficulty(
                    learningProfile.currentDifficulty,
                  )}
                </strong>{' '}
                reading mission using the current
                learning profile.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-5 text-center shadow">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Recommended Difficulty
              </p>

              <p className="mt-2 text-2xl font-black text-green-800">
                {formatDifficulty(
                  learningProfile.currentDifficulty,
                )}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/reading"
            className="rounded-2xl bg-green-700 px-8 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-green-800"
          >
            View Reading Forest
          </Link>

          <Link
            to="/"
            className="rounded-2xl bg-slate-700 px-8 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-slate-800"
          >
            Back to Academy Home
          </Link>
        </div>
      </div>
    </main>
  )
}

type DashboardCardProps = {
  icon: string
  label: string
  value: string | number
}

function DashboardCard({
  icon,
  label,
  value,
}: DashboardCardProps) {
  return (
    <article className="rounded-[2rem] bg-white p-6 text-center shadow-md">
      <p className="text-5xl">
        {icon}
      </p>

      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">
        {value}
      </p>
    </article>
  )
}

type ProfileRowProps = {
  label: string
  value: string
}

function ProfileRow({
  label,
  value,
}: ProfileRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
      <span className="font-semibold text-slate-600">
        {label}
      </span>

      <span className="font-black text-slate-900">
        {value}
      </span>
    </div>
  )
}

export default DadDashboard