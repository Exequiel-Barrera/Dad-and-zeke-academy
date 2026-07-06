function App() {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-8">

      <h1 className="text-5xl font-bold text-blue-900 mb-4">
        🎓 Dad & Zeke Academy
      </h1>

      <h2 className="text-2xl mb-8">
        Welcome back, Explorer!
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl text-center">

        <p className="text-lg mb-2">
          ⭐ Stars: 0
        </p>

        <p className="text-lg mb-6">
          🏅 Level: Little Explorer
        </p>

        <h3 className="text-3xl font-semibold mb-4">
          🦖 Today's Adventure
        </h3>

        <p className="text-xl mb-8">
          The Lost Dinosaur Egg
        </p>

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl"
        >
          Start Adventure
        </button>

      </div>

    </div>
  )
}

export default App