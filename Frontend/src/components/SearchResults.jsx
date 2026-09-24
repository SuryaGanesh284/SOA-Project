function SearchResults({ query, results, view }) {
  return (
    <section className="px-6" aria-label="Search results">
      <h2 className="text-lg font-semibold">Results for “{query.trim()}”</h2>
      <p className="mt-1 text-sm text-muted">
        {results.length} {results.length === 1 ? 'title' : 'titles'}
      </p>

      {results.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No titles match that search.</p>
      ) : view === 'list' ? (
        <ul className="mt-5 divide-y divide-slate-100">
          {results.map((book) => (
            <li key={book.title} className="flex items-center gap-4 py-3">
              <span className={`size-12 shrink-0 rounded-md bg-linear-to-br ${book.swatch}`} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{book.title}</p>
                <p className="truncate text-xs text-muted">{book.author}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 grid grid-cols-4 gap-4">
          {results.map((book) => (
            <article key={book.title} className="min-w-0">
              <div className={`aspect-[3/4] rounded-lg bg-linear-to-br ${book.swatch}`} />
              <h3 className="mt-2 truncate text-sm font-medium">{book.title}</h3>
              <p className="truncate text-xs text-muted">{book.author}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SearchResults
