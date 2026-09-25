import { useState } from 'react'
import { addRequirement } from '../data/requirements.js'

function AdminRequirements({ requirements, onChange, onFulfill }) {
  const [draft, setDraft] = useState({ title: '', note: '' })
  const [message, setMessage] = useState('')

  return (
    <section className="px-6" aria-label="Requirements">
      <h2 className="text-lg font-semibold">Requirements</h2>
      <p className="mt-1 text-sm text-muted">{requirements.filter((item) => item.status === 'OPEN').length} open</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {requirements.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted">{item.note}</p>
            </div>
            {item.status === 'OPEN' ? (
              <button type="button" onClick={() => onFulfill(item.id)} className="text-sm font-medium text-ink">
                Fulfill
              </button>
            ) : (
              <span className="text-sm text-emerald-600">FULFILLED</span>
            )}
          </li>
        ))}
      </ul>

      <form
        className="mt-6 max-w-md space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const result = addRequirement(requirements, draft)
          if (result.error) {
            setMessage(result.error)
            return
          }
          onChange(result.requirements)
          setDraft({ title: '', note: '' })
          setMessage('Requirement added.')
        }}
      >
        <p className="text-sm font-medium">Add requirement</p>
        <label className="block text-sm font-medium">
          Title
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            className="mt-1 h-11 w-full rounded-xl bg-field px-3 font-normal outline-none"
          />
        </label>
        <label className="block text-sm font-medium">
          Note
          <input
            value={draft.note}
            onChange={(event) => setDraft({ ...draft, note: event.target.value })}
            className="mt-1 h-11 w-full rounded-xl bg-field px-3 font-normal outline-none"
          />
        </label>
        <button type="submit" className="h-10 rounded-xl bg-navy px-4 text-sm font-medium text-white">
          Save
        </button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </form>
    </section>
  )
}

export default AdminRequirements
