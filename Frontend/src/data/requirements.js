import { requirementsApi } from '../services/api.js'

const REQUIREMENTS_KEY = 'archivalia-requirements'

const starter = [
  {
    id: 1,
    title: 'Designing Data-Intensive Applications',
    note: 'Requested for the databases course',
    status: 'OPEN',
  },
  {
    id: 2,
    title: 'The Art of Computer Programming, Vol. 2',
    note: 'Second volume for the stacks',
    status: 'FULFILLED',
  },
]

export function loadRequirements() {
  const saved = localStorage.getItem(REQUIREMENTS_KEY)
  return saved ? JSON.parse(saved) : starter
}

export function saveRequirements(requirements) {
  localStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(requirements))
  return requirements
}

export async function fetchRequirementsFromBackend() {
  try {
    const res = await requirementsApi.getRequirements()
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return saveRequirements(res.data)
    }
  } catch {
    // Fallback to local
  }
  return loadRequirements()
}

export function addRequirement(requirements, draft) {
  const title = draft.title.trim()
  if (!title) return { error: 'Enter a title.' }
  const next = [
    ...requirements,
    { id: Date.now(), title, note: draft.note.trim(), status: 'OPEN' },
  ]
  return { requirements: saveRequirements(next) }
}

export async function addRequirementAsync(requirements, draft) {
  const localRes = addRequirement(requirements, draft)
  if (localRes.error) return localRes

  try {
    const apiRes = await requirementsApi.addRequirement(draft)
    if (!apiRes.error && apiRes.data) {
      const refreshed = await requirementsApi.getRequirements()
      if (refreshed.data && Array.isArray(refreshed.data)) {
        return { requirements: saveRequirements(refreshed.data) }
      }
    }
  } catch {
    // Fallback to local
  }
  return localRes
}

export function fulfillRequirement(requirements, requirementId) {
  const next = requirements.map((item) => (item.id === requirementId ? { ...item, status: 'FULFILLED' } : item))
  return saveRequirements(next)
}

export async function fulfillRequirementAsync(requirements, requirementId) {
  const localUpdated = fulfillRequirement(requirements, requirementId)
  saveRequirements(localUpdated)

  try {
    await requirementsApi.fulfillRequirement(requirementId)
    const refreshed = await requirementsApi.getRequirements()
    if (refreshed.data && Array.isArray(refreshed.data)) {
      return saveRequirements(refreshed.data)
    }
  } catch {
    // Fallback to local
  }
  return localUpdated
}
