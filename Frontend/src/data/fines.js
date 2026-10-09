import { fineApi } from '../services/api.js'

const FINES_KEY = 'archivalia-fines'

const starter = [
  {
    id: 1,
    fineCode: 'fine-1',
    title: 'Clean Code',
    amount: 40,
    reason: 'Returned 2 days late',
    status: 'PENDING',
  },
  {
    id: 2,
    fineCode: 'fine-2',
    title: 'Atomic Habits',
    amount: 20,
    reason: 'Returned 1 day late',
    status: 'PAID',
  },
]

export function loadFines() {
  const saved = localStorage.getItem(FINES_KEY)
  return saved ? JSON.parse(saved) : starter
}

export function saveFines(fines) {
  localStorage.setItem(FINES_KEY, JSON.stringify(fines))
  return fines
}

export async function fetchFinesFromBackend(user) {
  try {
    const res = (user?.role === 'ADMIN')
      ? await fineApi.getAllFines()
      : await fineApi.getMyFines(user?.userId || 'USR-101')

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return saveFines(res.data)
    }
  } catch {
    // Fallback to local storage
  }
  return loadFines()
}

export function payFine(fines, fineId) {
  const next = fines.map((fine) => ((fine.id === fineId || fine.fineCode === fineId) ? { ...fine, status: 'PAID' } : fine))
  return saveFines(next)
}

export function waiveFine(fines, fineId) {
  const next = fines.map((fine) => ((fine.id === fineId || fine.fineCode === fineId) ? { ...fine, status: 'WAIVED' } : fine))
  return saveFines(next)
}

export async function payFineAsync(fines, fineId, user = {}, paymentData = {}) {
  try {
    const targetFine = fines.find((f) => f.id === fineId || f.fineCode === fineId)
    const backendId = targetFine?.id || fineId

    let orderSuccess = false
    try {
      const orderRes = await fineApi.createPaymentOrder(backendId)
      if (orderRes.data && orderRes.data.orderId) {
        const simPaymentId = `pay_rzp_sim_${Date.now()}`
        const verifyRes = await fineApi.verifyPayment(
          orderRes.data.orderId,
          simPaymentId,
          backendId
        )
        if (!verifyRes.error) {
          orderSuccess = true
        }
      }
    } catch {
      // Fallback if payment order endpoint is unavailable
    }

    if (!orderSuccess) {
      await fineApi.payFine(backendId, {
        reference: paymentData.reference || `pay_rzp_${Date.now()}`,
        method: paymentData.method || 'RAZORPAY_SANDBOX',
      })
    }

    const refreshed = (user?.role === 'ADMIN')
      ? await fineApi.getAllFines()
      : await fineApi.getMyFines(user?.userId || 'USR-101')

    if (refreshed.data && Array.isArray(refreshed.data)) {
      return saveFines(refreshed.data)
    }
  } catch {
    // Fallback to local offline state
  }
  return payFine(fines, fineId)
}

export async function waiveFineAsync(fines, fineId, user = {}, reason = 'Waived by library administrator') {
  try {
    const targetFine = fines.find((f) => f.id === fineId || f.fineCode === fineId)
    const backendId = targetFine?.id || fineId

    await fineApi.waiveFine(backendId, reason)

    const refreshed = (user?.role === 'ADMIN')
      ? await fineApi.getAllFines()
      : await fineApi.getMyFines(user?.userId || 'USR-101')

    if (refreshed.data && Array.isArray(refreshed.data)) {
      return saveFines(refreshed.data)
    }
  } catch {
    // Fallback to local offline state
  }
  return waiveFine(fines, fineId)
}

export async function createFineAsync(fineData, user = {}) {
  try {
    const res = await fineApi.createFine({
      ...fineData,
      userId: user?.userId || 'USR-101',
      userName: user?.name || 'Ben Bradle',
      userEmail: user?.email || 'user@archivalia.test',
    })
    if (!res.error) {
      const refreshed = (user?.role === 'ADMIN')
        ? await fineApi.getAllFines()
        : await fineApi.getMyFines(user?.userId || 'USR-101')
      if (refreshed.data && Array.isArray(refreshed.data)) {
        return saveFines(refreshed.data)
      }
    }
  } catch {
    // Fallback
  }
  return loadFines()
}

