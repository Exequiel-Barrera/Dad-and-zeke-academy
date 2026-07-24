type ForestDecorationProps = {
  scenery: string[]
}

function ForestDecoration({
  scenery,
}: ForestDecorationProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <span className="absolute left-[3%] top-[8%] text-5xl">
        {scenery[0]}
      </span>

      <span className="absolute right-[4%] top-[22%] text-4xl">
        {scenery[1]}
      </span>

      <span className="absolute left-[5%] top-[46%] text-5xl">
        {scenery[2]}
      </span>

      <span className="absolute right-[3%] top-[61%] text-4xl">
        {scenery[3]}
      </span>

      <span className="absolute left-[8%] top-[78%] animate-pulse text-3xl">
        {scenery[4]}
      </span>

      <span className="absolute right-[8%] top-[88%] text-4xl">
        {scenery[5]}
      </span>
    </div>
  )
}

export default ForestDecoration