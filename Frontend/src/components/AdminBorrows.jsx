function AdminBorrows({ loans }) {
  return (
    <section className="px-6" aria-label="Borrows">
      <h2 className="text-lg font-semibold">Borrows</h2>
      <p className="mt-1 text-sm text-muted">{loans.length} records</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {loans.map((loan) => (
          <li key={loan.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{loan.title}</p>
              <p className="text-xs text-muted">
                {loan.copyCode} · borrowed {loan.borrowedAt} · due {loan.dueAt}
              </p>
            </div>
            <p className={`shrink-0 text-sm ${loan.returnedAt ? 'text-emerald-600' : 'font-medium'}`}>
              {loan.returnedAt ? `Returned ${loan.returnedAt}` : 'Active'}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminBorrows
