type TrailGuideProps = {
  image?: string
  message: string
  position: 'left' | 'right'
}

function TrailGuide({
  image,
  message,
  position,
}: TrailGuideProps) {
  const positionClass =
    position === 'left'
      ? 'left-[8%] md:left-[14%]'
      : 'right-[8%] md:right-[14%]'

  return (
    <div
      className={`pointer-events-none absolute top-10 z-30 flex flex-col items-center ${positionClass}`}
    >
      <div className="relative">
        <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-yellow-400 bg-white shadow-lg ring-4 ring-yellow-200 md:h-32 md:w-32">
          {image ? (
            <img
              src={image}
              alt="Explorer Zeke"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">
              👦
            </div>
          )}
        </div>

        <div className="absolute -bottom-2 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-black/15 blur-sm" />
      </div>

      <div className="mt-3 max-w-52 rounded-2xl border-2 border-yellow-500 bg-white px-4 py-3 text-center text-sm font-bold text-green-950 shadow">
        {message}
      </div>
    </div>
  )
}

export default TrailGuide