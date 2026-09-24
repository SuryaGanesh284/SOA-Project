import { formatOf } from '../data/catalog.js'

function ResourceDetail({ book, onBack }) {
  const available = book.copies.filter((copy) => copy.status === 'AVAILABLE').length

  return (
    <section className="px-6" aria-label={book.title}>
      <button type="button" onClick={onBack} className="text-sm text-muted hover:text-ink">
        Back
      </button>

      <div className="mt-4 flex gap-6">
        <div className={`h-56 w-40 shrink-0 rounded-xl bg-linear-to-br ${book.swatch}`} />
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold">{book.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {book.author} · {book.year}
          </p>
          <p className="mt-2 text-sm text-amber-400" aria-label={`${book.rating} out of 5 stars`}>
            {'★'.repeat(book.rating)}
            <span className="text-slate-200">{'★'.repeat(5 - book.rating)}</span>
          </p>
          <p className="mt-3 text-sm">{formatOf(book)}</p>
          <p className="mt-2 max-w-xl text-sm text-muted">{book.description}</p>
          <p className="mt-4 text-sm font-medium">
            {available} of {book.copies.length} available
          </p>
        </div>
      </div>

      <h3 className="mt-8 text-lg font-semibold">Copies</h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {book.copies.map((copy) => (
          <li key={copy.code} className="flex items-center justify-between py-3 text-sm">
            <span className="font-medium">{copy.code}</span>
            <span className="text-muted">{copy.location}</span>
            <span className={copy.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-muted'}>{copy.status}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ResourceDetail
