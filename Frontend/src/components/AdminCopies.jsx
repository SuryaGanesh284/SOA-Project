import { copyStatus } from '../data/loans.js'
import { setCopyStatus } from '../data/catalog.js'

const statuses = ['AVAILABLE', 'BORROWED', 'MAINTENANCE']

function AdminCopies({ books, loans, onChange }) {
  const rows = books
    .filter((book) => book.groups.includes('physical'))
    .flatMap((book) => book.copies.map((copy) => ({ ...copy, title: book.title, shown: copyStatus(copy, loans) })))

  return (
    <section className="px-6" aria-label="Copies">
      <h2 className="text-lg font-semibold">Copies</h2>
      <p className="mt-1 text-sm text-muted">{rows.length} physical copies</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {rows.map((copy) => (
          <li key={copy.code} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{copy.title}</p>
              <p className="text-xs text-muted">
                {copy.code} · {copy.location}
                {copy.shown !== copy.status ? ` · showing ${copy.shown}` : ''}
              </p>
            </div>
            <select
              aria-label={`Status for ${copy.code}`}
              value={copy.status}
              onChange={(event) => onChange(setCopyStatus(books, copy.code, event.target.value))}
              className="h-10 rounded-xl bg-field px-3 text-sm outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminCopies
