type ExplorerCampProps = {
  completedCount: number
  totalMissions: number
  stars?: number
  rexImage?: string
  dadImage?: string
  zekeImage?: string
}

function ExplorerCamp({
  completedCount,
  totalMissions,
  stars = 0,
  rexImage,
  dadImage,
  zekeImage,
}: ExplorerCampProps) {
  const remainingMissions = Math.max(
    totalMissions - completedCount,
    0,
  )

  const allComplete =
    totalMissions > 0 &&
    completedCount === totalMissions

  function getWelcomeMessage() {
    if (allComplete) {
      return 'You completed Reading Forest! The Dinosaur Nest is waiting for you.'
    }

    if (completedCount === 0) {
      return 'Welcome, Explorer Zeke! Rex is ready to begin the first adventure.'
    }

    if (remainingMissions === 1) {
      return 'Amazing work! Only one adventure remains before you reach the Dinosaur Nest.'
    }

    return `Great exploring! You have completed ${completedCount} adventures. Rex is ready to continue.`
  }

  return (
    <section className="relative mx-auto mb-16 w-full max-w-5xl overflow-hidden rounded-[3rem] border-4 border-amber-700 bg-gradient-to-b from-sky-200 via-emerald-100 to-green-200 px-5 pb-8 pt-7 shadow-xl md:px-10 md:pb-10">
      {/* Sky decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-8 text-5xl opacity-80"
      >
        ☁️
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-7 text-5xl"
      >
        ☀️
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[18%] top-28 text-3xl"
      >
        🦋
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[15%] top-32 text-3xl"
      >
        🐦
      </div>

      {/* Header */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-amber-700 bg-amber-100 px-5 py-2 shadow">
          <span aria-hidden="true" className="text-3xl">
            🏕️
          </span>

          <h2 className="text-2xl font-black text-amber-950 md:text-3xl">
            Explorer Camp
          </h2>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-green-950 md:text-xl">
          The home base for every Reading Forest
          adventure.
        </p>
      </div>

      {/* Camp scene */}
      <div className="relative z-10 mt-8 min-h-[390px] rounded-[2.5rem] border-4 border-green-700/40 bg-green-300/50 px-4 pb-7 pt-6 shadow-inner md:min-h-[430px] md:px-8">
        {/* Background trees */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-6 text-7xl md:left-8 md:text-8xl"
        >
          🌳
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-8 text-7xl md:right-8 md:text-8xl"
        >
          🌲
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-6 text-5xl md:left-16"
        >
          🌿
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 right-8 text-5xl md:right-20"
        >
          🍄
        </div>

        {/* Tent */}
        <div className="relative mx-auto mt-6 flex w-fit flex-col items-center">
          <div
            aria-hidden="true"
            className="text-8xl drop-shadow-lg md:text-9xl"
          >
            ⛺
          </div>

          <div className="-mt-2 rounded-full bg-amber-950/20 px-12 py-2 blur-sm" />
        </div>

        {/* Characters */}
        <div className="relative mx-auto mt-2 grid max-w-3xl grid-cols-3 items-end gap-2 md:gap-8">
          <CampCharacter
            image={dadImage}
            fallback="👨"
            name="Dad"
            description="Adventure Guide"
          />

          <CampCharacter
            image={zekeImage}
            fallback="👦"
            name="Zeke"
            description="Forest Explorer"
            featured
          />

          <CampCharacter
            image={rexImage}
            fallback="🦖"
            name="Rex"
            description="Reading Guide"
          />
        </div>

        {/* Camp objects */}
        <div className="relative mx-auto mt-5 flex max-w-2xl flex-wrap items-end justify-center gap-5 md:gap-10">
          <CampObject
            icon="🎒"
            label="Adventure Pack"
          />

          <CampObject
            icon="🔥"
            label="Campfire"
            animated
          />

          <CampObject
            icon="🧰"
            label="Star Chest"
            value={`${stars} ⭐`}
          />
        </div>
      </div>

      {/* Welcome panel */}
      <div className="relative z-10 mx-auto -mt-3 max-w-3xl rounded-[2rem] border-4 border-amber-600 bg-amber-50 p-5 text-center shadow-lg md:p-7">
        <p className="text-xl font-black text-amber-950 md:text-2xl">
          Welcome back, Explorer Zeke!
        </p>

        <p className="mt-3 text-base font-semibold leading-relaxed text-amber-900 md:text-lg">
          {getWelcomeMessage()}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <div className="rounded-full border-2 border-green-700 bg-green-100 px-5 py-2 font-black text-green-900">
            Adventures: {completedCount}/{totalMissions}
          </div>

          <div className="rounded-full border-2 border-yellow-600 bg-yellow-100 px-5 py-2 font-black text-yellow-900">
            Stars: {stars} ⭐
          </div>
        </div>

        <div className="mt-5 h-5 overflow-hidden rounded-full border-2 border-green-800 bg-white">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-700"
            style={{
              width:
                totalMissions > 0
                  ? `${Math.min(
                      (completedCount /
                        totalMissions) *
                        100,
                      100,
                    )}%`
                  : '0%',
            }}
          />
        </div>
      </div>
    </section>
  )
}

type CampCharacterProps = {
  image?: string
  fallback: string
  name: string
  description: string
  featured?: boolean
}

function CampCharacter({
  image,
  fallback,
  name,
  description,
  featured = false,
}: CampCharacterProps) {
  return (
    <div
      className={`flex flex-col items-center ${
        featured ? '-translate-y-3' : ''
      }`}
    >
      <div
        className={`flex aspect-square w-24 items-center justify-center overflow-hidden rounded-full border-4 bg-white/80 shadow-lg md:w-32 ${
          featured
            ? 'border-yellow-500 ring-4 ring-yellow-200'
            : 'border-green-700'
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-6xl md:text-7xl"
          >
            {fallback}
          </span>
        )}
      </div>

      <div className="mt-2 rounded-2xl border-2 border-green-800 bg-white/90 px-3 py-2 text-center shadow">
        <p className="font-black text-green-950">
          {name}
        </p>

        <p className="text-xs font-bold text-green-700 md:text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}

type CampObjectProps = {
  icon: string
  label: string
  value?: string
  animated?: boolean
}

function CampObject({
  icon,
  label,
  value,
  animated = false,
}: CampObjectProps) {
  return (
    <div className="flex min-w-28 flex-col items-center rounded-2xl border-2 border-amber-700 bg-amber-100/90 px-4 py-3 shadow">
      <span
        aria-hidden="true"
        className={`text-5xl ${
          animated ? 'animate-pulse' : ''
        }`}
      >
        {icon}
      </span>

      <span className="mt-1 text-sm font-black text-amber-950">
        {label}
      </span>

      {value && (
        <span className="mt-1 text-sm font-bold text-yellow-800">
          {value}
        </span>
      )}
    </div>
  )
}

export default ExplorerCamp