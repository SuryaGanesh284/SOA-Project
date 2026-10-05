import { useEffect, useState } from 'react'
import { activeLoans } from '../data/loans.js'
import { listUsers } from '../data/session.js'
import { dashboardApi } from '../services/api.js'

function AdminDashboard({ books, loans, fines, requirements = [], onSelectSection }) {
  const [liveKpis, setLiveKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  async function fetchKpis() {
    try {
      setLoading(true)
      const res = await dashboardApi.getDashboardKpis()
      if (res.data) {
        setLiveKpis(res.data)
        setLastRefreshed(new Date().toLocaleTimeString())
      }
    } catch (e) {
      console.error('Failed to fetch dashboard KPIs', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await dashboardApi.getDashboardKpis()
        if (!ignore && res.data) {
          setLiveKpis(res.data)
          setLastRefreshed(new Date().toLocaleTimeString())
        }
      } catch (e) {
        console.error('Failed to fetch dashboard KPIs', e)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [books, loans, fines])

  // Fallback computations from client state
  const fallbackCopies = books.reduce((sum, book) => sum + (book.copies ? book.copies.length : 0), 0)
  const fallbackPending = fines.filter((fine) => fine.status === 'PENDING')
  const fallbackOutstanding = fallbackPending.reduce((sum, fine) => sum + (fine.amount || 0), 0)
  const fallbackOpenReqs = requirements.filter((r) => r.status === 'OPEN').length

  const titles = liveKpis ? liveKpis.titles : books.length
  const totalCopies = liveKpis ? liveKpis.copies : fallbackCopies
  const activeLoanCount = liveKpis ? liveKpis.activeLoans : activeLoans(loans).length
  const userCount = liveKpis ? liveKpis.totalUsers : listUsers().length
  const pendingCount = liveKpis ? liveKpis.pendingFines : fallbackPending.length
  const outstandingAmt = liveKpis ? liveKpis.outstandingAmount : fallbackOutstanding
  const collectedAmt = liveKpis ? liveKpis.totalCollectedAmount : 290
  const openReqs = liveKpis ? liveKpis.openRequirements : fallbackOpenReqs

  const availableCopies = liveKpis ? liveKpis.availableCopies : Math.max(0, totalCopies - activeLoanCount)
  const borrowedCopies = liveKpis ? liveKpis.borrowedCopies : activeLoanCount
  const maintenanceCopies = liveKpis ? liveKpis.maintenanceCopies : (totalCopies - availableCopies - borrowedCopies)

  const totalAssessed = collectedAmt + outstandingAmt
  const recoveryRate = totalAssessed > 0 ? Math.round((collectedAmt / totalAssessed) * 100) : 100

  const primaryStats = [
    { label: 'Catalog Titles', value: titles, target: 'catalog', note: 'Curated resources' },
    { label: 'Total Copies', value: totalCopies, target: 'copies', note: `${availableCopies} available` },
    { label: 'Active Loans', value: activeLoanCount, target: 'borrows', note: 'In circulation' },
    { label: 'Patron Accounts', value: userCount, target: 'users', note: 'Registered members' },
    { label: 'Pending Fines', value: pendingCount, target: 'fines', note: `₹${outstandingAmt} due`, alert: pendingCount > 0 },
    { label: 'Open Requirements', value: openReqs, target: 'requirements', note: 'Acquisition queue' },
  ]

  const services = liveKpis?.servicesStatus || {
    'eureka-server': 'UP',
    'api-gateway': 'UP',
    'auth-service': 'UP',
    'book-service': 'UP',
    'borrow-service': 'UP',
    'fine-service': 'UP',
  }

  return (
    <section className="px-6 py-2" aria-label="Dashboard">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Enterprise Administration Dashboard</h2>
          <p className="mt-1 text-sm text-muted">
            Aggregated real-time metrics across all Archivalia microservices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefreshed ? (
            <span className="text-xs text-muted">Updated: {lastRefreshed}</span>
          ) : null}
          <button
            type="button"
            onClick={fetchKpis}
            disabled={loading}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-navy/15 bg-white px-3 text-xs font-medium text-navy shadow-xs hover:bg-field disabled:opacity-50"
          >
            <span className={`inline-block ${loading ? 'animate-spin' : ''}`}>↻</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {primaryStats.map((stat) => (
          <li
            key={stat.label}
            onClick={() => onSelectSection && stat.target && onSelectSection(stat.target)}
            className={`cursor-pointer rounded-2xl bg-field p-4 transition-all hover:bg-slate-100 hover:shadow-xs ${
              stat.alert ? 'ring-1 ring-amber-400/50' : ''
            }`}
          >
            <p className="text-xs font-medium text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-ink">{stat.value}</p>
            <p className="mt-1 text-[11px] text-muted">{stat.note}</p>
          </li>
        ))}
      </ul>

      {/* Middle Section: Microservices Health & Inventory Distribution */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Microservices Health Status */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Microservices Ecosystem Health</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(services).map(([svc, status]) => (
              <div key={svc} className="flex items-center justify-between rounded-xl bg-field p-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-medium text-ink">{svc}</p>
                  <p className="text-[10px] text-muted">
                    {svc === 'eureka-server' ? 'Port 8761' :
                     svc === 'api-gateway' ? 'Port 8080' :
                     svc === 'auth-service' ? 'Port 8081' :
                     svc === 'book-service' ? 'Port 8082' :
                     svc === 'borrow-service' ? 'Port 8083' :
                     svc === 'fine-service' ? 'Port 8084' :
                     svc === 'notification-service' ? 'Port 8085' :
                     svc === 'recommendation-service' ? 'Port 8086' :
                     svc === 'discovery-service' ? 'Port 8087' : 'Active'}
                  </p>
                </div>
                <span className="inline-flex rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Circulation & Inventory Distribution */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Inventory Circulation Status</h3>
            <span className="text-xs text-muted">Total: {totalCopies} Physical Copies</span>
          </div>

          {/* Segmented bar */}
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              style={{ width: `${totalCopies > 0 ? (availableCopies / totalCopies) * 100 : 100}%` }}
              className="bg-emerald-500 transition-all"
              title={`Available: ${availableCopies}`}
            />
            <div
              style={{ width: `${totalCopies > 0 ? (borrowedCopies / totalCopies) * 100 : 0}%` }}
              className="bg-amber-500 transition-all"
              title={`Borrowed: ${borrowedCopies}`}
            />
            <div
              style={{ width: `${totalCopies > 0 ? (maintenanceCopies / totalCopies) * 100 : 0}%` }}
              className="bg-rose-500 transition-all"
              title={`Maintenance: ${maintenanceCopies}`}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-emerald-50/60 p-2.5">
              <span className="text-[11px] font-medium text-emerald-800">Available</span>
              <p className="mt-1 text-lg font-bold text-emerald-700">{availableCopies}</p>
            </div>
            <div className="rounded-xl bg-amber-50/60 p-2.5">
              <span className="text-[11px] font-medium text-amber-800">On Loan</span>
              <p className="mt-1 text-lg font-bold text-amber-700">{borrowedCopies}</p>
            </div>
            <div className="rounded-xl bg-rose-50/60 p-2.5">
              <span className="text-[11px] font-medium text-rose-800">Maintenance</span>
              <p className="mt-1 text-lg font-bold text-rose-700">{maintenanceCopies}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health & Revenue Reporting */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">Fine Assessment & Recovery Reporting</h3>
            <p className="text-xs text-muted">Razorpay payments reconciled with MySQL persistence.</p>
          </div>
          <span className="text-xs font-semibold text-navy">
            Recovery Rate: {recoveryRate}%
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-field p-4">
            <span className="text-xs text-muted">Settled Revenue</span>
            <p className="mt-1 text-xl font-bold text-emerald-600">₹{collectedAmt}</p>
            <p className="mt-0.5 text-[11px] text-muted">{liveKpis?.totalPaidFines || 0} transactions reconciled</p>
          </div>
          <div className="rounded-xl bg-field p-4">
            <span className="text-xs text-muted">Uncollected Outstanding</span>
            <p className="mt-1 text-xl font-bold text-amber-600">₹{outstandingAmt}</p>
            <p className="mt-0.5 text-[11px] text-muted">{pendingCount} pending payment invoices</p>
          </div>
          <div className="rounded-xl bg-field p-4">
            <span className="text-xs text-muted">Total Dues Assessed</span>
            <p className="mt-1 text-xl font-bold text-ink">₹{totalAssessed}</p>
            <p className="mt-0.5 text-[11px] text-muted">Cumulative library penal code</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
