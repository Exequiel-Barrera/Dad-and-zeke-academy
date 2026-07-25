type WorldCharacterProps = {
  mascot: string
  message?: string
  position: 'left' | 'right'
}

function WorldCharacter({
  mascot,
  message = 'Zeke is here!',
  position,
}: WorldCharacterProps) {
  const positionClassName =
    position === 'left'
      ? 'right-2 md:-right-16'
      : 'left-2 md:-left-16'

  return (
    <div
      className={`absolute -top-20 z-30 flex flex-col items-center ${positionClassName}`}
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="block animate-bounce text-7xl"
        >
          {mascot}
        </span>

        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 h-3 w-14 -translate-x-1/2 rounded-full bg-black/15"
        />
      </div>

      <span className="mt-3 whitespace-nowrap rounded-full border-2 border-green-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow">
        {message}
      </span>
    </div>
  )
}

export default WorldCharacter