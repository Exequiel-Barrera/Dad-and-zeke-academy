type StoryCardProps = {
  text: string
}

function StoryCard({ text }: StoryCardProps) {
  return (
    <div className="rounded-3xl bg-green-50 p-8 shadow">
      <p className="text-center text-6xl">🦖🌲</p>

      <p className="mt-6 text-2xl leading-relaxed">
        {text}
      </p>
    </div>
  )
}

export default StoryCard