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
    <section className="relative mx-auto mb-20 w-full max-w-5xl overflow-hidden rounded-[3rem] border-4 border-amber-700 bg-gradient-to-b from-sky-200 via-emerald-100 to-green-200 px-5 pb-8 pt-7 shadow-xl md:px-10 md:pb-12">
      {/* Ambient sky */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] top-[8%] animate-pulse text-5xl"
      >
        ☁️
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[7%] top-[6%] animate-pulse text-5xl"
      >
        ☀️
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[20%] top-[18%] animate-bounce text-3xl"
      >
        🦋
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[18%] top-[20%] animate-pulse text-3xl"
      >
        🐦
      </span>

      {/* Header */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-amber-700 bg-amber-100 px-5 py-2 shadow">
          <span className="text-3xl">🏕️</span>

          <h2 className="text-2xl font-black text-amber-950 md:text-3xl">
            Explorer Camp
          </h2>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-green-950 md:text-xl">
          The home base for every Reading Forest adventure.
        </p>
      </div>

      {/* Camp scene */}
      <div className="relative z-10 mt-8 min-h-[610px] rounded-[2.5rem] border-4 border-green-700/40 bg-green-300/50 px-4 pb-10 pt-8 shadow-inner md:min-h-[650px] md:px-8">
        {/* Background scenery */}
        <span
          aria-hidden="true"
          className="absolute left-4 top-8 text-7xl md:left-10 md:text-8xl"
        >
          🌳
        </span>

        <span
          aria-hidden="true"
          className="absolute right-4 top-10 text-7xl md:right-10 md:text-8xl"
        >
          🌲
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-10 left-5 animate-pulse text-4xl md:left-12"
        >
          🌿
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-12 right-8 text-5xl md:right-16"
        >
          🍄
        </span>

        {/* Tent */}
        <div className="relative mx-auto mt-4 flex w-fit flex-col items-center">
          <span
            aria-hidden="true"
            className="text-8xl drop-shadow-lg md:text-9xl"
          >
            ⛺
          </span>

          <div className="-mt-2 h-3 w-28 rounded-full bg-black/15 blur-sm" />
        </div>

        {/* Characters */}
        <div className="relative mx-auto mt-4 grid max-w-4xl grid-cols-1 items-end gap-8 md:grid-cols-3">
          <CampCharacter
            image={dadImage}
            fallback="👨"
            name="Dad"
            role="Adventure Guide"
          />

          <CampCharacter
            image={zekeImage}
            fallback="👦"
            name="Zeke"
            role="Forest Explorer"
            featured
          />

          <CampCharacter
            image={rexImage}
            fallback="🦖"
            name="Rex"
            role="Reading Guide"
            guide
          />
        </div>

        {/* Ground objects */}
        <div className="relative mx-auto mt-10 flex max-w-3xl flex-wrap items-end justify-center gap-12 md:gap-20">
          <GroundObject
            icon="🎒"
            label="Adventure Pack"
          />

          <GroundObject
            icon="🔥"
            label="Campfire"
            animated
          />

          <GroundObject
            icon="🧰"
            label="Star Chest"
            value={`${stars} ⭐`}
            bounce={stars > 0}
          />
        </div>

        {/* Trail start */}
        <div className="mx-auto mt-12 flex flex-col items-center">
          <p className="rounded-full bg-white/90 px-5 py-2 text-lg font-black text-green-900 shadow">
            Forest Trail
          </p>

          <div className="mt-3 h-20 w-5 rounded-full bg-amber-700/70" />

          <span className="-mt-2 text-3xl">👣</span>
        </div>
      </div>

      {/* Welcome */}
      <div className="relative z-20 mx-auto -mt-6 max-w-3xl rounded-[2rem] border-4 border-amber-600 bg-amber-50 p-6 text-center shadow-lg md:p-8">
        <h3 className="text-2xl font-black text-amber-950 md:text-3xl">
          Welcome back, Explorer Zeke!
        </h3>

        <p className="mt-3 text-lg font-semibold text-amber-900">
          {getWelcomeMessage()}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border-2 border-green-700 bg-green-100 px-5 py-2 font-black text-green-900">
            Adventures: {completedCount}/{totalMissions}
          </span>

          <span className="rounded-full border-2 border-yellow-600 bg-yellow-100 px-5 py-2 font-black text-yellow-900">
            Stars: {stars} ⭐
          </span>
        </div>

        <div className="mt-5 h-5 overflow-hidden rounded-full border-2 border-green-800 bg-white">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-700"
            style={{
              width:
                totalMissions > 0
                  ? `${Math.min(
                      (completedCount / totalMissions) * 100,
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
  role: string
  featured?: boolean
  guide?: boolean
}

function CampCharacter({
  image,
  fallback,
  name,
  role,
  featured = false,
  guide = false,
}: CampCharacterProps) {
  return (
    <div
      className={`flex flex-col items-center ${
        featured ? 'animate-pulse' : ''
      }`}
    >
      <div
        className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-full border-[6px] bg-white/90 shadow-lg ${
          guide
            ? 'h-56 w-56 border-green-700 md:h-60 md:w-60'
            : 'h-52 w-52 border-green-700 md:h-56 md:w-56'
        } ${
          featured
            ? 'ring-8 ring-yellow-300/70'
            : ''
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={`${name}, ${role}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-8xl">
            {fallback}
          </span>
        )}
      </div>

      <div className="-mt-2 h-4 w-32 rounded-full bg-black/15 blur-sm" />

      <div className="mt-2 min-w-52 rounded-3xl border-4 border-green-800 bg-white px-6 py-4 text-center shadow-md">
        <h3 className="text-3xl font-black text-green-950">
          {name}
        </h3>

        <p className="mt-1 text-xl font-bold text-green-700">
          {role}
        </p>
      </div>
    </div>
  )
}

type GroundObjectProps = {
  icon: string
  label: string
  value?: string
  animated?: boolean
  bounce?: boolean
}

function GroundObject({
  icon,
  label,
  value,
  animated = false,
  bounce = false,
}: GroundObjectProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        aria-hidden="true"
        className={`text-7xl drop-shadow-md ${
          animated
            ? 'animate-pulse'
            : bounce
              ? 'animate-bounce'
              : ''
        }`}
      >
        {icon}
      </span>

      <div className="mt-2 h-3 w-20 rounded-full bg-black/15 blur-sm" />

      <p className="mt-2 font-black text-amber-950">
        {label}
      </p>

      {value && (
        <p className="mt-1 font-bold text-yellow-900">
          {value}
        </p>
      )}
    </div>
  )
}

export default ExplorerCamp