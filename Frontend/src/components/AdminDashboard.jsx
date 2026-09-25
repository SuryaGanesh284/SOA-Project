import { catalog } from '../data/catalog.js'
import { activeLoans } from '../data/loans.js'
import { listUsers } from '../data/session.js'

function AdminDashboard({ loans, fines }) {
  const copies = catalog.reduce((sum, book) => sum + book.copies.length, 0)
  const pending = fines.filter((fine) => fine.status === 'PENDING')
  const outstanding = pending.reduce((sum, fine) => sum + fine.amount, 0)
  const stats = [
    { label: 'Titles', value: catalog.length },
    { label: 'Copies', value: copies },
    { label: 'Active loans', value: activeLoans(loans).length },
    { label: 'Users', value: listUsers().length },
    { label: 'Pending fines', value: pending.length },
    { label: 'Outstanding', value: `₹${outstanding}` },
  ]

  return (
    <section className="px-6" aria-label="Dashboard">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <p className="mt-1 text-sm text-muted">Catalog, circulation, and accounts.</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label} className="rounded-2xl bg-field px-4 py-4">
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminDashboard
