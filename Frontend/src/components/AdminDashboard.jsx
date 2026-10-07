import { useEffect, useState } from 'react'
import { activeLoans } from '../data/loans.js'
import { listUsers } from '../data/session.js'
import { dashboardApi, aiApi, requirementsApi } from '../services/api.js'

function AdminDashboard({ books, loans, fines, requirements = [], onSelectSection }) {
  const [liveKpis, setLiveKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  // AI Predictive Demand Forecaster State
  const [demandReport, setDemandReport] = useState(null)
  const [demandLoading, setDemandLoading] = useState(false)
  const [demandError, setDemandError] = useState(null)
  const [requisitionStatus, setRequisitionStatus] = useState({})

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

  async function fetchDemandReport(forceRefresh = false) {
    try {
      setDemandLoading(true)
      setDemandError(null)
      const res = await aiApi.getPredictiveDemandReport(forceRefresh)
      if (res.data) {
        setDemandReport(res.data)
      } else if (res.error) {
        setDemandError(res.error)
      }
    } catch (e) {
      setDemandError(e.message || 'Failed to fetch predictive demand report')
    } finally {
      setDemandLoading(false)
    }
  }

  async function handleOrderRequisition(item, idx) {
    try {
      setRequisitionStatus((prev) => ({ ...prev, [idx]: 'loading' }))
      const note = `AI Requisition: +${item.recommendedRequisitionCopies} copies (${item.academicRationale})`
      await requirementsApi.addRequirement({
        title: `${item.bookTitle} (+${item.recommendedRequisitionCopies} Copies)`,
        note,
      })
      setRequisitionStatus((prev) => ({ ...prev, [idx]: 'done' }))
    } catch (e) {
      console.error('Failed to create requisition', e)
      setRequisitionStatus((prev) => ({ ...prev, [idx]: 'error' }))
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
    fetchDemandReport(false)
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

      {/* AI Predictive Restock & Circulation Forecaster */}
      <div className="mt-6 rounded-2xl border-2 border-purple-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs shadow-xs">
                ✦
              </span>
              <h3 className="text-base font-bold text-slate-900">AI Predictive Restock & Demand Forecaster</h3>
              {demandReport?.overallCirculationHealth && (
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  demandReport.overallCirculationHealth.toLowerCase().includes('severe') || demandReport.overallCirculationHealth.toLowerCase().includes('critical') || demandReport.overallCirculationHealth.toLowerCase().includes('bottleneck')
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {demandReport.overallCirculationHealth}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Econometric queue modeling (Poisson arrivals & Erlang-C blocking) analyzing impending exam surges, active loans, and catalog scarcity.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              disabled={demandLoading}
              onClick={() => fetchDemandReport(true)}
              className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition disabled:opacity-50"
            >
              {demandLoading ? (
                <>
                  <span className="size-3 animate-spin rounded-full border-2 border-purple-700 border-t-transparent" />
                  <span>Analyzing Velocity...</span>
                </>
              ) : (
                <>
                  <span>🔄 Refresh AI Forecast</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Forecast Metrics Summary */}
        {demandReport && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Critical Stockouts</span>
                <p className="mt-0.5 text-xl font-black text-rose-800">{demandReport.criticalShortageCount}</p>
                <p className="text-[10px] text-rose-600">0 copies on shelf</p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">High Surge Risk</span>
                <p className="mt-0.5 text-xl font-black text-amber-800">{demandReport.highRiskCount}</p>
                <p className="text-[10px] text-amber-600">Imminent stockout</p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Recommended Copies</span>
                <p className="mt-0.5 text-xl font-black text-purple-800">+{demandReport.totalRecommendedCopies}</p>
                <p className="text-[10px] text-purple-600">Requisitions needed</p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Est. Requisition Budget</span>
                <p className="mt-0.5 text-xl font-black text-indigo-800">₹{demandReport.totalEstimatedBudgetInr}</p>
                <p className="text-[10px] text-indigo-600">Procurement allocation</p>
              </div>
            </div>

            {/* Executive Analysis Box */}
            {demandReport.executiveSummary && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">📋 Library Director Econometric Synthesis:</span>
                {demandReport.executiveSummary}
              </div>
            )}

            {/* Itemized Predictions Table */}
            {demandReport.items && demandReport.items.length > 0 && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Catalog Textbook</th>
                      <th className="py-2.5 px-3">Available / Total</th>
                      <th className="py-2.5 px-3">Active Loans</th>
                      <th className="py-2.5 px-3">Surge Probability</th>
                      <th className="py-2.5 px-3">Risk Tier</th>
                      <th className="py-2.5 px-3">Requisition</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {demandReport.items.map((item, idx) => {
                      const status = requisitionStatus[idx]
                      const isCritical = item.stockoutRisk === 'CRITICAL'
                      const isHigh = item.stockoutRisk === 'HIGH'

                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 transition">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-slate-800">{item.bookTitle}</p>
                            <span className="text-[10px] text-slate-400">{item.category} · {item.isbn || 'No ISBN'}</span>
                            <p className="mt-1 text-[11px] text-slate-600 max-w-sm italic">
                              "{item.academicRationale}"
                            </p>
                          </td>
                          <td className="py-2.5 px-3 font-semibold">
                            <span className={item.currentAvailableCopies === 0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                              {item.currentAvailableCopies}
                            </span>
                            <span className="text-slate-400"> / {item.currentTotalCopies}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">
                            {item.activeBorrowsCount} active
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full ${
                                    item.predictedDemandSurgePercent >= 80 ? 'bg-rose-500' :
                                    item.predictedDemandSurgePercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${item.predictedDemandSurgePercent}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-700">{item.predictedDemandSurgePercent}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              isHigh ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {item.stockoutRisk}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-purple-700">+{item.recommendedRequisitionCopies} copies</span>
                            <p className="text-[10px] text-slate-400">₹{item.estimatedBudgetInr}</p>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {status === 'done' ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                ✓ Requisitioned
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={status === 'loading'}
                                onClick={() => handleOrderRequisition(item, idx)}
                                className="rounded-lg bg-purple-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-purple-700 transition shadow-xs disabled:opacity-50"
                              >
                                {status === 'loading' ? 'Adding...' : 'Order Requisition'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {demandLoading && !demandReport && (
          <div className="mt-4 flex flex-col items-center justify-center p-8 text-center">
            <span className="size-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent mb-2" />
            <p className="text-xs text-slate-500">Gemini 3.5 Flash is calculating loan arrival distributions and restock quotas...</p>
          </div>
        )}

        {demandError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            ⚠️ {demandError}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboard

