import Header from './Header.tsx'
import StatsCard from './StatsCard.tsx'
import MissionCard from './MissionCard.tsx'
import NavigationCards from './NavigationCards.tsx'

function App() {
  return (
    <main className="min-h-screen bg-sky-100 p-8">
      <Header />
      <div className="mx-auto mt-10 max-w-4xl space-y-8">
        <StatsCard />
        <MissionCard />
        <NavigationCards />
      </div>
    </main>
  )
}

export default App