import { useParams } from 'react-router'

import Pandalolo from '../components/characters/Pandalolo'
import MissionEngine from '../components/mission/MissionEngine'
import { usePlayer } from '../context/PlayerContext'
import { writingMissions } from '../data/missions'

function WritingMission() {
  const { missionId } = useParams()
  const { player, addStars, completeMission } = usePlayer()

  const mission = writingMissions.find(
    (writingMission) => writingMission.id === missionId,
  )

  if (!mission) {
    return (
      <main className="min-h-screen bg-purple-100 p-8">
        <p className="text-center text-3xl font-bold text-red-700">
          Mission not found.
        </p>
      </main>
    )
  }

  const currentMission = mission

  const missionCompleted = player.completedMissions.includes(
    currentMission.id,
  )

  function handleMissionComplete() {
    addStars(currentMission.stars)
    completeMission(currentMission.id)
  }

  return (
    <MissionEngine
      missionId={currentMission.id}
      missionNumber={currentMission.number}
      title={currentMission.title}
      instruction={currentMission.instruction}
      correctAnswer={currentMission.sentence}
      stars={currentMission.stars}
      completed={missionCompleted}
      onComplete={handleMissionComplete}
      mascot={
        <Pandalolo
          size="medium"
          message={`Let's complete Mission ${currentMission.number}: ${currentMission.title}!`}
        />
      }
    />
  )
}

export default WritingMission