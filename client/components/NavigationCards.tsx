import { Link } from 'react-router'

const cards = [
  { title: 'Reading Forest', emoji: '📖', path: '/reading' },
  { title: "Writer's Workshop", emoji: '✏️', path: '/writing' },
  { title: 'Maths Mountain', emoji: '🔢', path: '/maths' },
  { title: 'Discovery Lab', emoji: '🧪', path: '/discovery' },
  { title: 'Kindness Kingdom', emoji: '❤️', path: '/character' },
  { title: 'Hall of Fame', emoji: '🏆', path: '/rewards' },
]

function NavigationCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.title}
          to={card.path}
          className="rounded-2xl bg-white p-6 text-center shadow hover:scale-105"
        >
          <p className="text-5xl">{card.emoji}</p>
          <p className="mt-2 text-2xl font-bold">{card.title}</p>
        </Link>
      ))}
    </section>
  )
}

export default NavigationCards