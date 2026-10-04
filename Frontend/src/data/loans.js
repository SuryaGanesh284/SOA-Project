import { catalog } from './catalog.js'
import { borrowApi } from '../services/api.js'

const LOANS_KEY = 'archivalia-loans'

function dueDate(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const starter = [
  {
    id: 1,
    loanCode: 'loan-1',
    title: 'The Design of Everyday Things',
    copyCode: 'PHY-014',
    borrowedAt: dueDate(-10),
    dueAt: dueDate(4),
    returnedAt: null,
    status: 'ACTIVE',
  },
]

export function loadLoans() {
  const saved = localStorage.getItem(LOANS_KEY)
  return saved ? JSON.parse(saved) : starter
}

export function saveLoans(loans) {
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans))
  return loans
}

export async function fetchLoansFromBackend(user) {
  try {
    const res = (user?.role === 'ADMIN')
      ? await borrowApi.getAllBorrows()
      : await borrowApi.getMyBorrows(user?.userId || 'USR-101')

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return saveLoans(res.data)
    }
  } catch {
    // Fallback to local storage
  }
  return loadLoans()
}

export function activeLoans(loans) {
  return loans.filter((loan) => !loan.returnedAt)
}

export function loanHistory(loans) {
  return loans.filter((loan) => loan.returnedAt)
}

export function copyStatus(copy, loans) {
  if (activeLoans(loans).some((loan) => loan.copyCode === copy.code)) return 'BORROWED'
  if (loans.some((loan) => loan.copyCode === copy.code && loan.returnedAt)) return 'AVAILABLE'
  return copy.status
}

export function borrowTitle(loans, title) {
  const book = catalog.find((item) => item.title === title)
  const copy = book?.copies.find((item) => copyStatus(item, loans) === 'AVAILABLE')
  if (!copy) return { error: 'No copy is available.' }
  const next = [
    ...loans,
    {
      id: Date.now(),
      loanCode: `loan-${Date.now()}`,
      title,
      copyCode: copy.code,
      borrowedAt: dueDate(0),
      dueAt: dueDate(14),
      returnedAt: null,
      status: 'ACTIVE',
    },
  ]
  return { loans: saveLoans(next) }
}

export async function borrowTitleAsync(loans, title, user = {}, copyCode = null) {
  try {
    const apiRes = await borrowApi.borrowBook(title, copyCode, user)
    if (!apiRes.error && apiRes.data) {
      const refreshed = (user?.role === 'ADMIN')
        ? await borrowApi.getAllBorrows()
        : await borrowApi.getMyBorrows(user?.userId || 'USR-101')
      if (refreshed.data && Array.isArray(refreshed.data)) {
        return { loans: saveLoans(refreshed.data) }
      }
    } else if (apiRes.error) {
      return { error: apiRes.error }
    }
  } catch {
    // Fallback to local
  }
  return borrowTitle(loans, title)
}

export function returnLoan(loans, loanId) {
  const next = loans.map((loan) => (loan.id === loanId ? { ...loan, returnedAt: dueDate(0), status: 'RETURNED' } : loan))
  return saveLoans(next)
}

export async function returnLoanAsync(loans, loanId, user = {}) {
  try {
    const apiRes = await borrowApi.returnBook(loanId)
    if (!apiRes.error) {
      const refreshed = (user?.role === 'ADMIN')
        ? await borrowApi.getAllBorrows()
        : await borrowApi.getMyBorrows(user?.userId || 'USR-101')
      if (refreshed.data && Array.isArray(refreshed.data)) {
        return saveLoans(refreshed.data)
      }
    }
  } catch {
    // Fallback to local
  }
  return returnLoan(loans, loanId)
}
