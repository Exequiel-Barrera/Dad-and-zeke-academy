import { Link } from 'react-router'

type AcademyMissionCardProps = {
  id: string
  number: number
  title: string
  stars: number
  completed: boolean
  unlocked: boolean
  worldPath: string
}

function AcademyMissionCard({
  id,
  number,
  title,
  stars,
  completed,
  unlocked,
  worldPath,
}: AcademyMissionCardProps) {
  return (
    <article className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-purple-600">
            Mission {number}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-purple-900">
            {title}
          </h2>

          <p className="mt-2 text-lg">
            Reward: ⭐ {stars}
          </p>

          {completed && (
            <p className="mt-2 font-bold text-green-700">
              ✅ Completed
            </p>
          )}

          {!unlocked && (
            <p className="mt-2 font-bold text-gray-500">
              🔒 Complete Mission {number - 1} first
            </p>
          )}
        </div>

        {unlocked ? (
          <Link
            to={`/${worldPath}/mission/${id}`}
            className={`rounded-2xl px-6 py-3 text-center text-lg font-bold text-white ${
              completed
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-purple-700 hover:bg-purple-800'
            }`}
          >
            {completed ? 'View Mission' : 'Start Mission'}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-2xl bg-gray-400 px-6 py-3 text-lg font-bold text-white"
          >
            Locked 🔒
          </button>
        )}
      </div>
    </article>
  )
}

export default AcademyMissionCard