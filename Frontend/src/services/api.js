const API_BASE_URL = 'http://localhost:8080/api/v1'
const TOKEN_KEY = 'archivalia-token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getAuthToken()
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)
    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`
      return { error: errorMessage, status: response.status }
    }

    return { data, status: response.status }
  } catch (err) {
    return { error: 'Network error or backend is unavailable.', details: err.message }
  }
}

export const authApi = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (name, email, password, phone = '9876543210') => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    })
  },

  getCurrentUser: async () => {
    return apiRequest('/users/me', {
      method: 'GET',
    })
  },

  updateProfile: async (name, email, phone) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ name, email, phone }),
    })
  },

  getAllUsers: async () => {
    return apiRequest('/users', {
      method: 'GET',
    })
  },
}

export const catalogApi = {
  getBooks: async (query, format) => {
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (format) params.append('format', format)
    const qs = params.toString() ? `?${params.toString()}` : ''
    return apiRequest(`/books${qs}`, { method: 'GET' })
  },

  getBookById: async (id) => {
    return apiRequest(`/books/${id}`, { method: 'GET' })
  },

  getBookByTitle: async (title) => {
    return apiRequest(`/books/by-title/${encodeURIComponent(title)}`, { method: 'GET' })
  },

  upsertBook: async (draft) => {
    const payload = {
      originalTitle: draft.originalTitle || null,
      title: draft.title ? draft.title.trim() : '',
      author: draft.author ? draft.author.trim() : '',
      year: Number(draft.year),
      format: draft.format || 'ebooks',
      description: draft.description ? draft.description.trim() : '',
    }
    return apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getCopies: async () => {
    return apiRequest('/copies', { method: 'GET' })
  },

  updateCopyStatus: async (code, status) => {
    return apiRequest(`/copies/${code}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },
}

export const requirementsApi = {
  getRequirements: async () => {
    return apiRequest('/admin/inventory/requirements', { method: 'GET' })
  },

  addRequirement: async (draft) => {
    return apiRequest('/admin/inventory/requirements', {
      method: 'POST',
      body: JSON.stringify({
        title: draft.title ? draft.title.trim() : '',
        note: draft.note ? draft.note.trim() : '',
      }),
    })
  },

  fulfillRequirement: async (id) => {
    return apiRequest(`/admin/inventory/requirements/${id}/fulfill`, {
      method: 'PUT',
    })
  },
}
