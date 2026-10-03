import { catalog } from './catalog.js'

const LOANS_KEY = 'archivalia-loans'

function dueDate(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const starter = [
  {
    id: 'loan-1',
    title: 'The Design of Everyday Things',
    copyCode: 'PHY-014',
    borrowedAt: dueDate(-10),
    dueAt: dueDate(4),
    returnedAt: null,
  },
]

export function loadLoans() {
  const saved = localStorage.getItem(LOANS_KEY)
  return saved ? JSON.parse(saved) : starter
}

function saveLoans(loans) {
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans))
  return loans
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
      id: `loan-${Date.now()}`,
      title,
      copyCode: copy.code,
      borrowedAt: dueDate(0),
      dueAt: dueDate(14),
      returnedAt: null,
    },
  ]
  return { loans: saveLoans(next) }
}

export function returnLoan(loans, loanId) {
  const next = loans.map((loan) => (loan.id === loanId ? { ...loan, returnedAt: dueDate(0) } : loan))
  return saveLoans(next)
}
