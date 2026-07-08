const cards = [
  { title: 'Reading', emoji: '📖' },
  { title: 'Writing', emoji: '✏️' },
  { title: 'Maths', emoji: '🔢' },
  { title: 'Rewards', emoji: '🏆' },
]

function NavigationCards() {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.title}
          className="rounded-2xl bg-white p-6 text-center shadow hover:scale-105"
        >
          <p className="text-5xl">{card.emoji}</p>
          <p className="mt-2 text-2xl font-bold">{card.title}</p>
        </button>
      ))}
    </section>
  )
}

export default NavigationCards