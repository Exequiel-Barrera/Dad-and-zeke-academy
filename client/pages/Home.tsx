import Header from '../components/Header.tsx'
import StatsCard from '../components/StatsCard.tsx'
import MissionCard from '../components/MissionCard.tsx'
import NavigationCards from '../components/NavigationCards.tsx'
import GreatLearningTree from '../components/tree/GreatLearningTree.tsx'



function Home() {
  return (
    <main className="min-h-screen bg-sky-100 p-8">
      <Header />
     

<div className="mx-auto mt-10 max-w-4xl space-y-8">

  <GreatLearningTree stars={3} />

  <StatsCard />

  <MissionCard />

  <NavigationCards />

</div>
    </main>
  )
}

export default Home