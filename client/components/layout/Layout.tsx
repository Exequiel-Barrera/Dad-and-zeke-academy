import { Link, Outlet } from 'react-router'

function Layout() {
  return (
    <div className="min-h-screen bg-sky-100">
      <header className="bg-blue-700 px-8 py-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-3xl font-bold">
            🎓 Dad & Zeke Academy
          </h1>

          <nav className="flex gap-6 font-semibold">
            <Link to="/">Home</Link>
            <Link to="/reading">Reading</Link>
            <Link to="/writing">Writing</Link>
            <Link to="/maths">Maths</Link>
            <Link to="/discovery">Discovery</Link>
            <Link to="/character">Character</Link>
            <Link to="/rewards">Rewards</Link>
            <Link
  to="/dad-dashboard"
  className="transition hover:text-yellow-300"
>
  Dad Dashboard
</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout