import { useState } from 'react'

const arrivals = [
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    rating: 5,
    description: 'How everyday objects communicate, and why good design makes them easier to use.',
    swatch: 'from-sky-500 to-blue-900',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    rating: 4,
    description: 'A handbook of agile software craftsmanship for writing code that stays readable.',
    swatch: 'from-indigo-500 to-slate-900',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    rating: 5,
    description: 'Practical habits for building software that is easier to change and maintain.',
    swatch: 'from-emerald-500 to-teal-900',
  },
  {
    title: 'Algorithms to Live By',
    author: 'Brian Christian',
    rating: 4,
    description: 'Computer science ideas applied to everyday decisions, from sorting to stopping.',
    swatch: 'from-amber-500 to-orange-900',
  },
  {
    title: 'Structure and Interpretation',
    author: 'Harold Abelson',
    rating: 5,
    description: 'A classic introduction to programming through abstraction and recursion.',
    swatch: 'from-rose-500 to-red-950',
  },
]

const visibleCount = 3

function NewArrivals({ onOpen }) {
  const [start, setStart] = useState(0)
  const visible = Array.from({ length: visibleCount }, (_, index) => {
    return arrivals[(start + index) % arrivals.length]
  })

  function shift(direction) {
    setStart((current) => (current + direction + arrivals.length) % arrivals.length)
  }

  return (
    <section className="px-6" aria-label="New arrivals">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">New arrivals</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous arrivals"
            onClick={() => shift(-1)}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-field hover:text-ink"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next arrivals"
            onClick={() => shift(1)}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-field hover:text-ink"
          >
            <Chevron direction="right" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {visible.map((book) => (
          <article key={book.title} className="relative h-40 overflow-hidden rounded-xl text-white">
            <button type="button" onClick={() => onOpen(book.title)} className="absolute inset-0 z-10" aria-label={book.title} />
            <div className={`absolute inset-0 bg-linear-to-br ${book.swatch}`} />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="truncate text-sm font-semibold">{book.title}</h3>
              <p className="text-xs text-white/80">By {book.author}</p>
              <p className="mt-1 text-xs tracking-wide text-amber-300" aria-label={`${book.rating} out of 5 stars`}>
                {'★'.repeat(book.rating)}
                <span className="text-white/35">{'★'.repeat(5 - book.rating)}</span>
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-white/80">{book.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M12 5 7 10l5 5' : 'M8 5l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default NewArrivals
