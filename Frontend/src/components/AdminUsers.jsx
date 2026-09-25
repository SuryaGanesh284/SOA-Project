import { listUsers } from '../data/session.js'

function AdminUsers() {
  const users = listUsers()

  return (
    <section className="px-6" aria-label="Users">
      <h2 className="text-lg font-semibold">Users</h2>
      <p className="mt-1 text-sm text-muted">{users.length} accounts</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {users.map((user) => (
          <li key={user.email} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <p className="shrink-0 text-xs text-muted">{user.userId}</p>
            <p className="w-16 shrink-0 text-right text-sm font-medium">{user.role}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminUsers
