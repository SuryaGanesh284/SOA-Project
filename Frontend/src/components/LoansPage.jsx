function LoansPage({ loans, onReturn, onOpen }) {
  const active = loans.filter((loan) => !loan.returnedAt)
  const history = loans.filter((loan) => loan.returnedAt)

  return (
    <section className="px-6" aria-label="Loans">
      <h2 className="text-lg font-semibold">Active loans</h2>
      {active.length === 0 ? (
        <p className="mt-3 text-sm text-muted">You have no active loans.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {active.map((loan) => (
            <li key={loan.id} className="flex items-center justify-between gap-4 py-3">
              <button type="button" onClick={() => onOpen(loan.title)} className="min-w-0 text-left">
                <p className="truncate text-sm font-medium">{loan.title}</p>
                <p className="text-xs text-muted">
                  {loan.copyCode} · Due {loan.dueAt}
                </p>
              </button>
              <button type="button" onClick={() => onReturn(loan.id)} className="text-sm font-medium text-ink">
                Return
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold">History</h2>
      {history.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No returned loans yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {history.map((loan) => (
            <li key={loan.id} className="py-3">
              <p className="text-sm font-medium">{loan.title}</p>
              <p className="text-xs text-muted">
                {loan.copyCode} · Returned {loan.returnedAt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default LoansPage
