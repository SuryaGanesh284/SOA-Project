import { authApi, setAuthToken } from '../services/api.js'

const SESSION_KEY = 'archivalia-session'
const ACCOUNTS_KEY = 'archivalia-accounts'

const demoAccounts = [
  { name: 'Ben Bradle', email: 'user@archivalia.test', password: 'user123', role: 'USER' },
  { name: 'Library Admin', email: 'admin@archivalia.test', password: 'admin123', role: 'ADMIN' },
]

function readAccounts() {
  const saved = localStorage.getItem(ACCOUNTS_KEY)
  const extra = saved ? JSON.parse(saved) : []
  return [...demoAccounts, ...extra]
}

export function listUsers() {
  let nextUser = 102
  return readAccounts().map((account) => ({
    userId:
      account.userId ||
      (account.email === 'admin@archivalia.test'
        ? 'ADM-001'
        : account.email === 'user@archivalia.test'
          ? 'USR-101'
          : `USR-${nextUser++}`),
    name: account.name,
    email: account.email,
    role: account.role,
  }))
}

export async function fetchLiveUsers() {
  const res = await authApi.getAllUsers()
  if (res.data && Array.isArray(res.data)) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(res.data))
    return res.data
  }
  return listUsers()
}

export function loadSession() {
  const saved = localStorage.getItem(SESSION_KEY)
  return saved ? JSON.parse(saved) : null
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  setAuthToken(null)
}

export async function signIn(email, password) {
  const trimmedEmail = email.trim().toLowerCase()
  // 1. Try Backend Auth API first (MySQL + JWT)
  const res = await authApi.login(trimmedEmail, password)
  if (res.data?.token && res.data?.session) {
    setAuthToken(res.data.token)
    return { session: saveSession(res.data.session) }
  }

  if (res.error && !res.details) {
    // Backend returned a specific validation or credential error
    return { error: res.error }
  }

  // 2. Fallback to local accounts if backend network is unreachable
  const account = readAccounts().find((item) => item.email.toLowerCase() === trimmedEmail)
  if (!account || account.password !== password) {
    return { error: 'Email or password is incorrect.' }
  }
  return {
    session: saveSession({
      userId: account.userId || (account.role === 'ADMIN' ? 'ADM-001' : 'USR-101'),
      name: account.name,
      email: account.email,
      role: account.role,
    }),
  }
}

export async function register(name, email, password) {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedName || !trimmedEmail || password.length < 4) {
    return { error: 'Enter a name, email, and a password of at least 4 characters.' }
  }

  // 1. Try Backend Auth API first (MySQL + JWT)
  const res = await authApi.register(trimmedName, trimmedEmail, password)
  if (res.data?.token && res.data?.session) {
    setAuthToken(res.data.token)
    return { session: saveSession(res.data.session) }
  }

  if (res.error && !res.details) {
    // Backend returned a specific validation error (e.g. duplicate email)
    return { error: res.error }
  }

  // 2. Fallback to local accounts
  if (readAccounts().some((item) => item.email.toLowerCase() === trimmedEmail)) {
    return { error: 'An account with that email already exists.' }
  }
  const extra = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
  extra.push({ name: trimmedName, email: trimmedEmail, password, role: 'USER' })
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(extra))
  return { session: saveSession({ name: trimmedName, email: trimmedEmail, role: 'USER' }) }
}
