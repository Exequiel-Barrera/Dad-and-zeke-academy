import { Link } from 'react-router'
import TrailGuide from '../components/world/TrailGuide'
import Rex from '../components/characters/Rex'
import WorldAdventureMap from '../components/world/WorldAdventureMap'
import { usePlayer } from '../context/PlayerContext'
import { readingMissions } from '../data/missions'
import dadImage from '../assets/images/dad.png'
import zekeImage from '../assets/images/zeke.png'
import rexImage from '../assets/images/rex.png'
function Reading() {
  const { player } = usePlayer()
  
  const completedMissionCount =
  readingMissions.filter((mission) =>
    player.completedMissions.includes(mission.id),
  ).length

const currentMission = Math.min(
  completedMissionCount + 1,
  readingMissions.length,
)

  const mapMissions = readingMissions.map((mission) => ({
    id: mission.id,
    number: mission.number,
    title: mission.title,
    stars: mission.reward,
  }))

  return (
    <section className="min-h-[80vh] rounded-3xl bg-green-100 p-6 shadow-lg md:p-10">
      <div className="text-center">
        <Rex
          size="medium"
          message="Welcome to Reading Forest, Explorer Zeke! Complete each adventure to discover the next path."
        />

        <h1 className="mt-4 text-5xl font-bold text-green-900 md:text-6xl">
          Reading Forest
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-xl md:text-2xl">
          Follow the forest path, read each story, answer Rex&apos;s questions,
          and unlock new adventures.
        </p>

        <div className="mx-auto mt-6 inline-flex rounded-full bg-white px-6 py-3 text-xl font-bold text-green-900 shadow">
          Completed:{' '}
          {
            readingMissions.filter((mission) =>
              player.completedMissions.includes(mission.id),
            ).length
          }{' '}
          of {readingMissions.length}
        </div>
      </div>

   <WorldAdventureMap
  missions={mapMissions}
  completedMissions={player.completedMissions}
  worldPath="reading"
  theme="reading"
  stars={player.stars}
  dadImage={dadImage}
  zekeImage={zekeImage}
  rexImage={rexImage}
/>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="text-xl font-bold text-green-900 underline"
        >
          ← Back to Academy Home
        </Link>
      </div>
    </section>
  )
}

export default Reading