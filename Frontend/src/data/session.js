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

export function loadSession() {
  const saved = localStorage.getItem(SESSION_KEY)
  return saved ? JSON.parse(saved) : null
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function signIn(email, password) {
  const account = readAccounts().find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
  if (!account || account.password !== password) {
    return { error: 'Email or password is incorrect.' }
  }
  return { session: saveSession({ name: account.name, email: account.email, role: account.role }) }
}

export function register(name, email, password) {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedName || !trimmedEmail || password.length < 4) {
    return { error: 'Enter a name, email, and a password of at least 4 characters.' }
  }
  if (readAccounts().some((item) => item.email.toLowerCase() === trimmedEmail)) {
    return { error: 'An account with that email already exists.' }
  }
  const extra = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
  extra.push({ name: trimmedName, email: trimmedEmail, password, role: 'USER' })
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(extra))
  return { session: saveSession({ name: trimmedName, email: trimmedEmail, role: 'USER' }) }
}
