const trending = [
  { title: 'Clean Code', author: 'Robert C. Martin' },
  { title: 'Deep Work', author: 'Cal Newport' },
  { title: 'Atomic Habits', author: 'James Clear' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas' },
  { title: 'Algorithms to Live By', author: 'Brian Christian' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
  { title: 'The Design of Everyday Things', author: 'Don Norman' },
]

function Trending() {
  return (
    <section aria-label="Trending">
      <h2 className="mb-3 text-lg font-semibold">Trending</h2>
      <ol className="space-y-3">
        {trending.map((book, index) => (
          <li key={book.title} className="flex items-start gap-3">
            <span className="w-4 text-sm font-medium text-rose-500">{index + 1}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{book.title}</p>
              <p className="truncate text-xs text-muted">{book.author}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Trending
