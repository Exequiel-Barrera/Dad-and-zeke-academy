function MissionCard() {
  return (
    <section className="rounded-3xl bg-white p-10 text-center shadow-lg">
      <h2 className="text-4xl font-bold">🦖 Today's Adventure</h2>
      <p className="mt-4 text-3xl">The Lost Dinosaur Egg</p>

      <button className="mt-8 rounded-2xl bg-green-600 px-10 py-5 text-2xl font-bold text-white hover:bg-green-700">
        Start Adventure
      </button>
    </section>
  )
}

export default MissionCard