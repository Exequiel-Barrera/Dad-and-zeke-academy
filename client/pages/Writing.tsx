import { Link } from 'react-router'

import Pandalolo from '../components/characters/Pandalolo'
import WorldMissionMap from '../components/world/WorldMissionMap'
import { usePlayer } from '../context/PlayerContext'
import { writingMissions } from '../data/missions'

function Writing() {
  const { player } = usePlayer()

  const mapMissions = writingMissions.map((mission) => ({
    id: mission.id,
    number: mission.number,
    title: mission.title,
    stars: mission.stars,
  }))

  const completedCount = writingMissions.filter((mission) =>
    player.completedMissions.includes(mission.id),
  ).length

  return (
    <section className="min-h-[80vh] rounded-3xl bg-purple-100 p-6 shadow-lg md:p-10">
      <div className="text-center">
        <Pandalolo
          size="medium"
          message="Welcome to Writing Mountain! Let's practice writing and unlock new adventures!"
        />

        <h1 className="mt-4 text-5xl font-bold text-purple-900 md:text-6xl">
          Writing Mountain
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-xl md:text-2xl">
          Follow the writing trail, complete each mission, and become a Writing
          Champion.
        </p>

        <div className="mx-auto mt-6 inline-flex rounded-full bg-white px-6 py-3 text-xl font-bold text-purple-900 shadow">
          Completed: {completedCount} of {writingMissions.length}
        </div>
      </div>

      <WorldMissionMap
        missions={mapMissions}
        completedMissions={player.completedMissions}
        worldPath="writing"
        theme="writing"
      />

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="text-xl font-bold text-purple-900 underline"
        >
          ← Back to Academy Home
        </Link>
      </div>
    </section>
  )
}

export default Writing