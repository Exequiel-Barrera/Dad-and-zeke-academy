import { usePlayer } from '../context/PlayerContext'

function StatsCard() {
  const { player } = usePlayer()
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 text-center shadow">
        <p className="text-4xl">⭐</p>
        <p className="text-xl font-bold">Stars</p>
        <p className="text-2xl">{player.stars}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 text-center shadow">
        <p className="text-4xl">🏅</p>
        <p className="text-xl font-bold">Level</p>
        <p className="text-2xl">Level {player.level}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 text-center shadow">
        <p className="text-4xl">🔥</p>
        <p className="text-xl font-bold">Streak</p>
        <p className="text-2xl">0 days</p>
      </div>
    </section>
  )
}

export default StatsCard