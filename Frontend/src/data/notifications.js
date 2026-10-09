import { notificationApi } from '../services/api.js'

const NOTIFICATIONS_KEY = 'archivalia-notifications'

const starter = [
  { id: 1, title: 'Due soon', message: 'The Design of Everyday Things is due in 4 days.', read: false, type: 'LOAN_DUE' },
  { id: 2, title: 'Return recorded', message: 'Clean Code was returned.', read: false, type: 'LOAN_RETURN' },
  { id: 3, title: 'Payment', message: 'A fine payment is ready to confirm.', read: true, type: 'FINE_PAYMENT' },
]

export function loadNotifications() {
  const saved = localStorage.getItem(NOTIFICATIONS_KEY)
  return saved ? JSON.parse(saved) : starter
}

export function saveNotifications(notes) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notes))
  return notes
}

export async function fetchNotificationsFromBackend(user) {
  try {
    const res = await notificationApi.getMyNotifications(user?.userId || 'USR-101')
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return saveNotifications(res.data)
    }
  } catch {
    // Fallback to local
  }
  return loadNotifications()
}

export async function markNotificationReadAsync(notes, id) {
  try {
    await notificationApi.markAsRead(id)
  } catch {
    // Ignore and update locally
  }
  const next = notes.map((n) => ((n.id === id || n.notificationCode === id) ? { ...n, read: true } : n))
  return saveNotifications(next)
}

export async function markAllNotificationsReadAsync(notes, user) {
  try {
    await notificationApi.markAllAsRead(user?.userId || 'USR-101')
  } catch {
    // Ignore and update locally
  }
  const next = notes.map((n) => ({ ...n, read: true }))
  return saveNotifications(next)
}
