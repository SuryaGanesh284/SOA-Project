import { useState } from 'react'

function FinesPage({ fines, onPay }) {
  const [confirmId, setConfirmId] = useState(null)
  const pending = fines.find((fine) => fine.id === confirmId)
  const outstanding = fines.filter((fine) => fine.status === 'PENDING').reduce((sum, fine) => sum + fine.amount, 0)

  return (
    <section className="px-6" aria-label="Fines">
      <h2 className="text-lg font-semibold">Fines</h2>
      <p className="mt-1 text-sm text-muted">Outstanding ₹{outstanding}</p>

      <ul className="mt-4 divide-y divide-slate-100">
        {fines.map((fine) => (
          <li key={fine.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{fine.title}</p>
              <p className="text-xs text-muted">{fine.reason}</p>
            </div>
            <p className="text-sm font-medium">₹{fine.amount}</p>
            {fine.status === 'PENDING' ? (
              <button type="button" onClick={() => setConfirmId(fine.id)} className="text-sm font-medium text-ink">
                Pay
              </button>
            ) : (
              <span className={`text-sm ${fine.status === 'PAID' ? 'text-emerald-600' : 'text-muted'}`}>{fine.status}</span>
            )}
          </li>
        ))}
      </ul>

      {pending ? (
        <div className="mt-6 max-w-sm rounded-xl bg-field p-4">
          <p className="text-sm font-medium">Confirm payment</p>
          <p className="mt-1 text-sm text-muted">
            Pay ₹{pending.amount} for {pending.title}? This is a mock confirmation.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onPay(pending.id)
                setConfirmId(null)
              }}
              className="h-10 rounded-xl bg-navy px-4 text-sm font-medium text-white"
            >
              Confirm
            </button>
            <button type="button" onClick={() => setConfirmId(null)} className="h-10 rounded-xl px-4 text-sm text-muted">
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default FinesPage
