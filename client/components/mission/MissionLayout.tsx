import type { ReactNode } from 'react'
import { Link } from 'react-router'

type MissionTheme = 'writing' | 'reading'

type MissionLayoutProps = {
  missionNumber: number
  title: string
  mascot: ReactNode
  theme: MissionTheme
  children: ReactNode
  completed?: boolean
  backTo?: string
  backLabel?: string
}

const themeStyles = {
  writing: {
    background: 'bg-purple-100',
    title: 'text-purple-900',
    subtitle: 'text-purple-700',
    link: 'text-purple-900',
    emoji: '✏️',
  },
  reading: {
    background: 'bg-green-100',
    title: 'text-green-900',
    subtitle: 'text-green-700',
    link: 'text-green-900',
    emoji: '📖',
  },
}

function MissionLayout({
  missionNumber,
  title,
  mascot,
  theme,
  children,
  completed = false,
  backTo,
  backLabel = 'Return to world',
}: MissionLayoutProps) {
  const styles = themeStyles[theme]

  return (
    <main className={`min-h-screen p-6 md:p-10 ${styles.background}`}>
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          {mascot}

          <h1 className={`mt-5 text-4xl font-bold md:text-5xl ${styles.title}`}>
            {styles.emoji} Mission {missionNumber}
          </h1>

          <h2
            className={`mt-3 text-2xl font-bold md:text-3xl ${styles.subtitle}`}
          >
            {title}
          </h2>
        </header>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl md:p-10">
          {completed && (
            <div className="mb-8 rounded-2xl bg-green-100 p-4 text-center text-xl font-bold text-green-700">
              ✅ This mission has already been completed.
            </div>
          )}

          {children}
        </section>

        {backTo && (
          <div className="mt-8 text-center">
            <Link
              to={backTo}
              className={`text-lg font-bold underline ${styles.link}`}
            >
              ← {backLabel}
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default MissionLayout