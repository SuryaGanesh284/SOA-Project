import { useState } from 'react'
import { formatOf, upsertResource } from '../data/catalog.js'

const formats = [
  { id: 'ebooks', label: 'E-book' },
  { id: 'papers', label: 'Research paper' },
  { id: 'videos', label: 'Video' },
  { id: 'audio', label: 'Audio book' },
  { id: 'physical', label: 'Physical book' },
]

const empty = { originalTitle: '', title: '', author: '', year: '', format: 'ebooks', description: '' }

function AdminCatalog({ books, onChange }) {
  const [draft, setDraft] = useState(empty)
  const [message, setMessage] = useState('')

  function edit(book) {
    const format = formats.find((item) => book.groups.includes(item.id))?.id || 'ebooks'
    setMessage('')
    setDraft({
      originalTitle: book.title,
      title: book.title,
      author: book.author,
      year: String(book.year),
      format,
      description: book.description,
    })
  }

  return (
    <section className="px-6" aria-label="Catalog">
      <h2 className="text-lg font-semibold">Catalog</h2>
      <p className="mt-1 text-sm text-muted">{books.length} titles</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {books.map((book) => (
          <li key={book.title}>
            <button type="button" onClick={() => edit(book)} className="flex w-full items-center justify-between gap-4 py-3 text-left">
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{book.title}</span>
                <span className="block truncate text-xs text-muted">{book.author}</span>
              </span>
              <span className="shrink-0 text-xs text-muted">{formatOf(book)}</span>
            </button>
          </li>
        ))}
      </ul>

      <form
        className="mt-6 max-w-md space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const result = upsertResource(books, draft)
          if (result.error) {
            setMessage(result.error)
            return
          }
          onChange(result.books)
          setDraft(empty)
          setMessage(draft.originalTitle ? 'Resource updated.' : 'Resource added.')
        }}
      >
        <p className="text-sm font-medium">{draft.originalTitle ? 'Edit resource' : 'Add resource'}</p>
        <Field label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <Field label="Author" value={draft.author} onChange={(author) => setDraft({ ...draft, author })} />
        <Field label="Year" value={draft.year} onChange={(year) => setDraft({ ...draft, year })} />
        <label className="block text-sm font-medium">
          Format
          <select
            value={draft.format}
            onChange={(event) => setDraft({ ...draft, format: event.target.value })}
            className="mt-1 h-11 w-full rounded-xl bg-field px-3 font-normal outline-none"
          >
            {formats.map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            className="mt-1 h-24 w-full rounded-xl bg-field px-3 py-2 font-normal outline-none"
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="h-10 rounded-xl bg-navy px-4 text-sm font-medium text-white">
            Save
          </button>
          {draft.originalTitle ? (
            <button type="button" onClick={() => { setDraft(empty); setMessage('') }} className="h-10 rounded-xl px-4 text-sm text-muted">
              Cancel
            </button>
          ) : null}
        </div>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </form>
    </section>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-11 w-full rounded-xl bg-field px-3 font-normal outline-none" />
    </label>
  )
}

export default AdminCatalog
