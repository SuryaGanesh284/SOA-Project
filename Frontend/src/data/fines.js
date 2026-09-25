const FINES_KEY = 'archivalia-fines'

const starter = [
  {
    id: 'fine-1',
    title: 'Clean Code',
    amount: 40,
    reason: 'Returned 2 days late',
    status: 'PENDING',
  },
  {
    id: 'fine-2',
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

export function payFine(fines, fineId) {
  const next = fines.map((fine) => (fine.id === fineId ? { ...fine, status: 'PAID' } : fine))
  localStorage.setItem(FINES_KEY, JSON.stringify(next))
  return next
}

export function waiveFine(fines, fineId) {
  const next = fines.map((fine) => (fine.id === fineId ? { ...fine, status: 'WAIVED' } : fine))
  localStorage.setItem(FINES_KEY, JSON.stringify(next))
  return next
}
