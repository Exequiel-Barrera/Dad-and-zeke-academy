import type { WorldTheme } from './types'

type WorldMilestoneProps = {
  icon: string
  title: string
  description: string
  theme: WorldTheme
  locked?: boolean
}

function WorldMilestone({
  icon,
  title,
  description,
  theme,
  locked = false,
}: WorldMilestoneProps) {
  const themeClassName =
    theme === 'reading'
      ? 'border-blue-300 bg-blue-50 text-blue-950'
      : 'border-purple-300 bg-purple-50 text-purple-950'

  return (
    <section
      className={`mx-auto my-12 max-w-2xl rounded-[2rem] border-4 p-7 text-center shadow-md transition ${
        locked
          ? 'border-gray-300 bg-gray-100 text-gray-500 opacity-70'
          : themeClassName
      }`}
    >
      <div
        aria-hidden="true"
        className={`text-6xl ${locked ? 'grayscale' : ''}`}
      >
        {locked ? '🔒' : icon}
      </div>

      <h2 className="mt-4 text-3xl font-black">
        {title}
      </h2>

      <p className="mt-3 text-lg font-semibold">
        {description}
      </p>
    </section>
  )
}

export default WorldMilestone