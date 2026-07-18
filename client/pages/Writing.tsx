import Pandalolo from '../components/characters/Pandalolo'
import AcademyMissionCard from '../components/AcademyMissionCard'

import { writingMissions } from '../data/missions'
import { usePlayer } from '../context/PlayerContext'

function Writing() {
  const { player } = usePlayer()

  return (
    <main className="min-h-screen bg-purple-100 p-8">
      <div className="mx-auto max-w-4xl">
        <Pandalolo
          size="medium"
          message="Welcome to the Writer's Workshop! Complete each mission to unlock the next one."
        />

        <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-center text-4xl font-bold text-purple-900">
            ✏️ Writing Missions
          </h1>

          <div className="mt-8 space-y-5">
            {writingMissions.map((mission, index) => {
              const completed = player.completedMissions.includes(mission.id)

              const previousMission = writingMissions[index - 1]

              const unlocked =
                index === 0 ||
                player.completedMissions.includes(previousMission.id)

              return (
                <AcademyMissionCard
                  key={mission.id}
                  id={mission.id}
                  number={mission.number}
                  title={mission.title}
                  stars={mission.stars}
                  completed={completed}
                  unlocked={unlocked}
                  worldPath="writing"
                />
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Writing