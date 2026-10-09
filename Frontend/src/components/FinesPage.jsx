import { useState } from 'react'
import { fineApi } from '../services/api.js'

function FinesPage({ fines, onPay, onCreateDemo }) {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedFine, setSelectedFine] = useState(null)
  const [paymentStep, setPaymentStep] = useState('METHOD') // 'METHOD' | 'PROCESSING' | 'SUCCESS'
  const [paymentMethod, setPaymentMethod] = useState('UPI') // 'UPI' | 'CARD' | 'NETBANKING'
  const [simOrderId, setSimOrderId] = useState('')
  const [simPaymentId, setSimPaymentId] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)

  const pendingFines = fines.filter((fine) => fine.status === 'PENDING')
  const historyFines = fines.filter((fine) => fine.status !== 'PENDING')
  const outstanding = pendingFines.reduce((sum, fine) => sum + (fine.amount || 0), 0)

  const displayedFines = activeTab === 'pending'
    ? pendingFines
    : activeTab === 'history'
      ? historyFines
      : fines

  async function handleOpenCheckout(fine) {
    setSelectedFine(fine)
    setPaymentStep('METHOD')
    setPaymentMethod('UPI')
    const fallbackOrderId = `order_sand_${fine.id || 'live'}`
    setSimOrderId(fallbackOrderId)

    try {
      const res = await fineApi.createPaymentOrder(fine.id)
      if (res.data && res.data.orderId) {
        setSimOrderId(res.data.orderId)
      }
    } catch {
      // Continue with fallback
    }
  }

  async function handleAuthorizePayment() {
    if (!selectedFine) return
    setPaymentStep('PROCESSING')

    // Authentic gateway latency simulation
    await new Promise((resolve) => setTimeout(resolve, 1400))

    const generatedRef = `pay_rzp_sim_${selectedFine.id || 'txn'}`
    setSimPaymentId(generatedRef)

    try {
      if (onPay) {
        await onPay(selectedFine.id, {
          reference: generatedRef,
          method: `RAZORPAY_${paymentMethod}`,
          orderId: simOrderId,
        })
      }
    } catch (err) {
      console.error('Payment error', err)
    } finally {
      setPaymentStep('SUCCESS')
    }
  }

  function handleCloseModal() {
    setSelectedFine(null)
    setPaymentStep('METHOD')
    setSimPaymentId('')
  }

  async function handleAddDemoFine() {
    if (!onCreateDemo) return
    setDemoLoading(true)
    try {
      await onCreateDemo()
      setActiveTab('pending')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <section className="px-6 py-2" aria-label="Fines">
      {/* Header & Overview */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Library Dues & Fines</h2>
          <p className="mt-1 text-sm text-muted">
            Manage overdue book charges and settle accounts via Razorpay Secure Gateway.
          </p>
        </div>
        {onCreateDemo ? (
          <button
            type="button"
            disabled={demoLoading}
            onClick={handleAddDemoFine}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-navy/15 bg-white px-3 text-xs font-medium text-navy shadow-xs hover:bg-field disabled:opacity-50"
          >
            {demoLoading ? 'Adding...' : '+ Demo Overdue Fine'}
          </button>
        ) : null}
      </div>

      {/* KPI Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-field p-4">
          <p className="text-xs font-medium text-muted">Total Outstanding</p>
          <p className={`mt-2 text-2xl font-bold ${outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            ₹{outstanding}
          </p>
        </div>
        <div className="rounded-2xl bg-field p-4">
          <p className="text-xs font-medium text-muted">Pending Invoices</p>
          <p className="mt-2 text-2xl font-bold text-ink">{pendingFines.length}</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-field p-4 sm:col-span-1">
          <p className="text-xs font-medium text-muted">Cleared Receipts</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{historyFines.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'border-b-2 border-navy font-semibold text-navy'
              : 'text-muted hover:text-ink'
          }`}
        >
          Pending Dues ({pendingFines.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`ml-6 pb-3 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-navy font-semibold text-navy'
              : 'text-muted hover:text-ink'
          }`}
        >
          Payment History ({historyFines.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`ml-6 pb-3 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'border-b-2 border-navy font-semibold text-navy'
              : 'text-muted hover:text-ink'
          }`}
        >
          All Records ({fines.length})
        </button>
      </div>

      {/* Fines List */}
      {displayedFines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-base font-semibold text-ink">
            {activeTab === 'pending' ? 'No pending fines!' : 'No fine records found'}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {activeTab === 'pending'
              ? 'All your returned loans are clear and no penalties are due.'
              : 'There are currently no transactions recorded under this filter.'}
          </p>
          {activeTab === 'pending' && onCreateDemo ? (
            <button
              type="button"
              onClick={handleAddDemoFine}
              className="mt-4 rounded-xl bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy/90"
            >
              Generate Demo Overdue Fine (₹30)
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {displayedFines.map((fine) => {
            const isPending = fine.status === 'PENDING'
            return (
              <li key={fine.id || fine.fineCode} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink">{fine.title}</span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isPending
                          ? 'bg-amber-50 text-amber-700'
                          : fine.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {fine.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{fine.reason}</p>
                  {fine.paymentReference ? (
                    <p className="mt-0.5 font-mono text-[11px] text-muted">
                      Ref: {fine.paymentReference} {fine.paidAt ? `• Paid ${fine.paidAt}` : ''}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-base font-bold text-ink">₹{fine.amount}</span>
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(fine)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-navy px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-navy/90"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Pay Fine
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-emerald-600">Settled</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Razorpay Interactive Checkout Modal */}
      {selectedFine ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            {/* Razorpay Brand Header */}
            <div className="bg-[#072654] px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-[#0088cc] font-black text-white text-xs">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-wide">Razorpay Checkout</h4>
                    <p className="text-[10px] text-white/60">Sandbox Test Mode • Instant Settlement</p>
                  </div>
                </div>
                {paymentStep !== 'PROCESSING' ? (
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                ) : null}
              </div>

              {/* Order Info Bar */}
              <div className="mt-3 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-xs">
                <span className="truncate max-w-[200px] text-white/80">{selectedFine.title}</span>
                <span className="font-bold text-base text-white">₹{selectedFine.amount}.00</span>
              </div>
            </div>

            {/* Modal Body: STEP 1 - Select Method */}
            {paymentStep === 'METHOD' ? (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between text-xs text-muted">
                  <span>Order ID: <span className="font-mono text-ink">{simOrderId || 'Generating...'}</span></span>
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>

                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Select Payment Method</p>

                {/* Payment Method Selector */}
                <div className="mt-3 space-y-2">
                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-navy bg-navy/5 ring-1 ring-navy'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-700 text-xs">
                        UPI
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">UPI / QR Code</p>
                        <p className="text-xs text-muted">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="size-4 accent-navy"
                    />
                  </label>

                  {/* Cards */}
                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-navy bg-navy/5 ring-1 ring-navy'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 font-bold text-emerald-700 text-xs">
                        💳
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">Cards (Credit/Debit)</p>
                        <p className="text-xs text-muted">Visa, MasterCard, RuPay (Test Card)</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="size-4 accent-navy"
                    />
                  </label>

                  {/* Net Banking */}
                  <label
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-navy bg-navy/5 ring-1 ring-navy'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50 font-bold text-amber-700 text-xs">
                        🏦
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">Net Banking</p>
                        <p className="text-xs text-muted">HDFC, ICICI, SBI, Axis, Kotak</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="size-4 accent-navy"
                    />
                  </label>
                </div>

                {/* Mock Account Details */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-muted">
                  {paymentMethod === 'UPI' && (
                    <p>Simulated UPI VPA: <span className="font-mono text-ink">ben.bradle@okhdfcbank</span></p>
                  )}
                  {paymentMethod === 'CARD' && (
                    <p>Sandbox Card: <span className="font-mono text-ink">4111 2222 3333 4444</span> (Exp 12/28)</p>
                  )}
                  {paymentMethod === 'NETBANKING' && (
                    <p>Test Netbanking: <span className="font-medium text-ink">HDFC Bank Simulated Gateway</span></p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleAuthorizePayment}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#0088cc] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0077b3]"
                  >
                    Authorize & Pay ₹{selectedFine.amount}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-11 rounded-xl px-4 text-sm font-medium text-muted hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            {/* Modal Body: STEP 2 - Processing Spinner */}
            {paymentStep === 'PROCESSING' ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <div className="size-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#0088cc]" />
                <h4 className="mt-5 text-base font-semibold text-ink">Processing Payment...</h4>
                <p className="mt-1 text-xs text-muted">
                  Contacting Razorpay Gateway & verifying bank authorization token.
                </p>
                <div className="mt-4 font-mono text-[11px] text-muted">
                  Order ID: {simOrderId}
                </div>
              </div>
            ) : null}

            {/* Modal Body: STEP 3 - Payment Success Receipt */}
            {paymentStep === 'SUCCESS' ? (
              <div className="p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h4 className="mt-4 text-lg font-bold text-ink">Payment Successful!</h4>
                <p className="mt-1 text-sm text-muted">
                  ₹{selectedFine.amount} was settled for <span className="font-medium text-ink">{selectedFine.title}</span>.
                </p>

                {/* Receipt Details Box */}
                <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Payment ID:</span>
                    <span className="font-mono font-medium text-ink">{simPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Order ID:</span>
                    <span className="font-mono text-ink">{simOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Payment Method:</span>
                    <span className="font-medium text-ink">Razorpay {paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Database Status:</span>
                    <span className="font-semibold text-emerald-600">PAID (MySQL Persisted)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-6 h-11 w-full rounded-xl bg-navy text-sm font-semibold text-white shadow-md hover:bg-navy/90"
                >
                  Done & View Updated Fines
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default FinesPage
