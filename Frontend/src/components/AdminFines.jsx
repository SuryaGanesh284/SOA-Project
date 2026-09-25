function AdminFines({ fines, onWaive }) {
  const pending = fines.filter((fine) => fine.status === 'PENDING')

  return (
    <section className="px-6" aria-label="Fines">
      <h2 className="text-lg font-semibold">Fines</h2>
      <p className="mt-1 text-sm text-muted">{pending.length} pending</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {fines.map((fine) => (
          <li key={fine.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{fine.title}</p>
              <p className="text-xs text-muted">{fine.reason}</p>
            </div>
            <p className="text-sm font-medium">₹{fine.amount}</p>
            {fine.status === 'PENDING' ? (
              <button type="button" onClick={() => onWaive(fine.id)} className="text-sm font-medium text-ink">
                Waive
              </button>
            ) : (
              <span className={`w-16 text-right text-sm ${fine.status === 'PAID' ? 'text-emerald-600' : 'text-muted'}`}>
                {fine.status}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminFines
