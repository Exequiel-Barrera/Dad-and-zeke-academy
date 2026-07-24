type WorldPathProps = {
  completed: boolean
  completedClassName: string
  direction: 'left-to-right' | 'right-to-left'
}

function WorldPath({
  completed,
  completedClassName,
  direction,
}: WorldPathProps) {
  const path =
    direction === 'left-to-right'
      ? 'M 80 10 C 160 10, 150 120, 280 120 C 390 120, 390 210, 500 210'
      : 'M 500 10 C 390 10, 400 120, 280 120 C 150 120, 160 210, 80 210'

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-56 w-full max-w-3xl"
    >
      <svg
        viewBox="0 0 580 220"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={path}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="14 16"
        />

        {completed && (
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="14 16"
            className={`${completedClassName} transition-all duration-1000`}
          />
        )}
      </svg>

      {completed && (
        <>
          <span className="absolute left-[30%] top-[34%] animate-pulse text-2xl">
            ⭐
          </span>

          <span className="absolute right-[30%] top-[67%] animate-pulse text-2xl">
            ⭐
          </span>
        </>
      )}
    </div>
  )
}

export default WorldPath