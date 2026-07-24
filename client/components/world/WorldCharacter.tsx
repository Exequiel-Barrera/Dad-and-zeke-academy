type WorldCharacterProps = {
  mascot: string
  message?: string
}

function WorldCharacter({
  mascot,
  message = 'Zeke is here!',
}: WorldCharacterProps) {
  return (
    <div className="absolute -right-3 -top-14 z-20 flex flex-col items-center">
      <span
        aria-hidden="true"
        className="animate-bounce text-6xl"
      >
        {mascot}
      </span>

      <span className="mt-1 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow">
        {message}
      </span>
    </div>
  )
}

export default WorldCharacter