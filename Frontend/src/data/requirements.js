const REQUIREMENTS_KEY = 'archivalia-requirements'

const starter = [
  {
    id: 'req-1',
    title: 'Designing Data-Intensive Applications',
    note: 'Requested for the databases course',
    status: 'OPEN',
  },
  {
    id: 'req-2',
    title: 'The Art of Computer Programming, Vol. 2',
    note: 'Second volume for the stacks',
    status: 'FULFILLED',
  },
]

export function loadRequirements() {
  const saved = localStorage.getItem(REQUIREMENTS_KEY)
  return saved ? JSON.parse(saved) : starter
}

function saveRequirements(requirements) {
  localStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(requirements))
  return requirements
}

export function addRequirement(requirements, draft) {
  const title = draft.title.trim()
  if (!title) return { error: 'Enter a title.' }
  const next = [
    ...requirements,
    { id: `req-${Date.now()}`, title, note: draft.note.trim(), status: 'OPEN' },
  ]
  return { requirements: saveRequirements(next) }
}

export function fulfillRequirement(requirements, requirementId) {
  const next = requirements.map((item) => (item.id === requirementId ? { ...item, status: 'FULFILLED' } : item))
  return saveRequirements(next)
}
