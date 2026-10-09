import { formatOf } from '../data/catalog.js'
import { copyStatus } from '../data/loans.js'

function ResourceDetail({ book, loans, onBack, onBorrow, onOpenStudyPack }) {
  const copies = book.copies.map((copy) => ({ ...copy, status: copyStatus(copy, loans) }))
  const available = copies.filter((copy) => copy.status === 'AVAILABLE').length

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
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBorrow}
              disabled={available === 0}
              className="h-10 rounded-xl bg-navy px-4 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-40"
            >
              {available === 0 ? 'No copies available' : 'Borrow'}
            </button>
            <button
              type="button"
              onClick={() => onOpenStudyPack && onOpenStudyPack(book)}
              className="h-10 rounded-xl border border-purple-200 bg-purple-50 px-4 text-sm font-medium text-purple-700 shadow-xs transition hover:bg-purple-100 flex items-center gap-1.5"
            >
              <span>📚 AI Study Pack & Quiz</span>
            </button>
          </div>
        </div>
      </div>

      <h3 className="mt-8 text-lg font-semibold">Copies</h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {copies.map((copy) => (
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
