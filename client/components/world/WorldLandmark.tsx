type WorldLandmarkProps = {
  icon: string
  title: string
  description?: string
  position?: 'left' | 'center' | 'right'
  locked?: boolean
}

function WorldLandmark({
  icon,
  title,
  description,
  position = 'center',
  locked = false,
}: WorldLandmarkProps) {
  const positionClassName = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[position]

  return (
    <div
      className={`relative my-8 w-full max-w-sm ${positionClassName}`}
    >
      <div
        className={`rounded-[2rem] border-4 p-5 text-center shadow-md transition ${
          locked
            ? 'border-gray-400 bg-gray-200 text-gray-500'
            : 'border-amber-700 bg-amber-100 text-amber-950'
        }`}
      >
        <div
          aria-hidden="true"
          className={`text-6xl ${locked ? 'grayscale' : ''}`}
        >
          {locked ? '🔒' : icon}
        </div>

        <h3 className="mt-3 text-2xl font-bold">
          {title}
        </h3>

        {description && (
          <p className="mt-2 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default WorldLandmark