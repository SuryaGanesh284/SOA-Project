const suggestions = [
  { title: 'Deep Work', author: 'Cal Newport', rating: 5, swatch: 'from-sky-400 to-blue-800' },
  { title: 'Atomic Habits', author: 'James Clear', rating: 4, swatch: 'from-amber-300 to-orange-700' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 5, swatch: 'from-slate-400 to-slate-800' },
  { title: 'The Art of Computer Programming', author: 'Donald Knuth', rating: 5, swatch: 'from-rose-400 to-red-900' },
  { title: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', rating: 4, swatch: 'from-emerald-400 to-teal-800' },
]

function ForYou({ onOpen }) {
  return (
    <section aria-label="For you">
      <h2 className="mb-3 text-lg font-semibold">For you</h2>
      <div className="grid grid-cols-4 gap-4">
        {suggestions.map((book) => (
          <button key={book.title} type="button" onClick={() => onOpen(book.title)} className="min-w-0 text-left">
            <div className={`aspect-[3/4] rounded-lg bg-linear-to-br ${book.swatch}`} />
            <h3 className="mt-2 truncate text-sm font-medium">{book.title}</h3>
            <p className="truncate text-xs text-muted">{book.author}</p>
            <p className="mt-1 text-xs tracking-wide text-amber-400" aria-label={`${book.rating} out of 5 stars`}>
              {'★'.repeat(book.rating)}
              <span className="text-slate-200">{'★'.repeat(5 - book.rating)}</span>
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ForYou
