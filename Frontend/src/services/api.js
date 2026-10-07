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
    if (endpoint.startsWith('/ai')) {
      try {
        const directUrl = `http://localhost:8088/api/v1${endpoint}`
        const directResp = await fetch(directUrl, config)
        const isJson = (directResp.headers.get('content-type') || '').includes('application/json')
        const directData = isJson ? await directResp.json() : await directResp.text()
        if (!directResp.ok) {
          return { error: directData?.error || directData?.message || `Request failed with status ${directResp.status}` }
        }
        return { data: directData, status: directResp.status }
      } catch (fallbackErr) {
        return { error: 'Network error or AI service is unavailable.', details: fallbackErr.message }
      }
    }
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

export const borrowApi = {
  getAllBorrows: async () => {
    return apiRequest('/borrows', { method: 'GET' })
  },

  getMyBorrows: async (userId) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return apiRequest(`/borrows/my${qs}`, { method: 'GET' })
  },

  borrowBook: async (title, copyCode, user = {}) => {
    return apiRequest('/borrows', {
      method: 'POST',
      body: JSON.stringify({
        title,
        copyCode: copyCode || null,
        userId: user.userId || 'USR-101',
        userName: user.name || 'Ben Bradle',
        userEmail: user.email || 'user@archivalia.test',
      }),
    })
  },

  returnBook: async (loanId) => {
    return apiRequest(`/borrows/${loanId}/return`, {
      method: 'POST',
    })
  },
}

export const fineApi = {
  createFine: async (fineData) => {
    return apiRequest('/fines', {
      method: 'POST',
      body: JSON.stringify({
        loanId: fineData.loanId || null,
        userId: fineData.userId || 'USR-101',
        userName: fineData.userName || 'Ben Bradle',
        userEmail: fineData.userEmail || 'user@archivalia.test',
        title: fineData.title,
        amount: Number(fineData.amount),
        reason: fineData.reason || 'Overdue return',
      }),
    })
  },

  getAllFines: async () => {
    return apiRequest('/fines', { method: 'GET' })
  },

  getMyFines: async (userId) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return apiRequest(`/fines/my${qs}`, { method: 'GET' })
  },

  payFine: async (fineId, paymentData = {}) => {
    return apiRequest(`/fines/${fineId}/pay`, {
      method: 'POST',
      body: JSON.stringify({
        reference: paymentData.reference || `pay_rzp_${Date.now()}`,
        method: paymentData.method || 'RAZORPAY_SANDBOX',
      }),
    })
  },

  waiveFine: async (fineId, reason = 'Administrative waiver') => {
    return apiRequest(`/fines/${fineId}/waive`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  },

  createPaymentOrder: async (fineId) => {
    return apiRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ fineId }),
    })
  },

  verifyPayment: async (orderId, paymentId, fineId) => {
    return apiRequest('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, fineId }),
    })
  },
}

export const dashboardApi = {
  getDashboardKpis: async () => {
    return apiRequest('/admin/dashboard', { method: 'GET' })
  },
}

export const notificationApi = {
  getMyNotifications: async (userId) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return apiRequest(`/notifications/me${qs}`, { method: 'GET' })
  },

  getAllNotifications: async () => {
    return apiRequest('/notifications', { method: 'GET' })
  },

  markAsRead: async (id) => {
    return apiRequest(`/notifications/${id}/read`, { method: 'PUT' })
  },

  markAllAsRead: async (userId) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return apiRequest(`/notifications/read-all${qs}`, { method: 'PUT' })
  },

  createNotification: async (draft) => {
    return apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(draft),
    })
  },
}

export const recommendationApi = {
  getMyRecommendations: async (userId, limit = 6) => {
    const qs = new URLSearchParams()
    if (userId) qs.append('userId', userId)
    if (limit) qs.append('limit', limit)
    const queryString = qs.toString() ? `?${qs.toString()}` : ''
    return apiRequest(`/recommendations/me${queryString}`, { method: 'GET' })
  },

  getSimilarBooks: async (title, limit = 4) => {
    const qs = new URLSearchParams({ title })
    if (limit) qs.append('limit', limit)
    return apiRequest(`/recommendations/similar?${qs.toString()}`, { method: 'GET' })
  },

  getTrending: async (limit = 5) => {
    const qs = limit ? `?limit=${encodeURIComponent(limit)}` : ''
    return apiRequest(`/recommendations/trending${qs}`, { method: 'GET' })
  },

  getPreferences: async (userId) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return apiRequest(`/recommendations/preferences/me${qs}`, { method: 'GET' })
  },

  savePreferences: async (preferences) => {
    return apiRequest('/recommendations/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    })
  },
}

export const discoveryApi = {
  search: async (query = '', source = 'ALL') => {
    const qs = new URLSearchParams()
    if (query) qs.append('q', query)
    if (source) qs.append('source', source)
    const queryString = qs.toString() ? `?${qs.toString()}` : ''
    return apiRequest(`/discovery/search${queryString}`, { method: 'GET' })
  },

  scrapeUrl: async (url) => {
    return apiRequest('/discovery/scrape-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    })
  },

  importToCatalog: async (bookData) => {
    return apiRequest('/discovery/import', {
      method: 'POST',
      body: JSON.stringify(bookData),
    })
  },

  getJobs: async () => {
    return apiRequest('/discovery/jobs', { method: 'GET' })
  },
}

export const aiApi = {
  getHealth: async () => {
    return apiRequest('/ai/health', { method: 'GET' })
  },

  submitResearchQuery: async ({ query, academicField, difficultyLevel, userId }) => {
    return apiRequest('/ai/research-assist', {
      method: 'POST',
      body: JSON.stringify({ query, academicField, difficultyLevel, userId }),
    })
  },

  getResearchHistory: async (userId) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return apiRequest(`/ai/research-assist/history${qs}`, { method: 'GET' })
  },

  getResearchSession: async (id) => {
    return apiRequest(`/ai/research-assist/${id}`, { method: 'GET' })
  },

  semanticSearch: async (query, catalogContext = null, limit = 5) => {
    return apiRequest('/ai/semantic-search', {
      method: 'POST',
      body: JSON.stringify({ query, catalogContext, limit }),
    })
  },

  getSynopsis: async ({ title, author, isbn, category }) => {
    return apiRequest('/ai/synopsis', {
      method: 'POST',
      body: JSON.stringify({ title, author, isbn, category }),
    })
  },

  getSynopsisByIdentifier: async (identifier) => {
    return apiRequest(`/ai/synopsis/${encodeURIComponent(identifier)}`, {
      method: 'GET',
    })
  },

  getStudyPack: async ({ bookTitle, author, isbn, topicOrExamFocus, difficultyLevel, forceRefresh = false }) => {
    return apiRequest('/ai/study-pack', {
      method: 'POST',
      body: JSON.stringify({ bookTitle, author, isbn, topicOrExamFocus, difficultyLevel, forceRefresh }),
    })
  },

  getStudyPackById: async (id) => {
    return apiRequest(`/ai/study-pack/${id}`, {
      method: 'GET',
    })
  },

  getStudyPackByIsbn: async (isbn) => {
    return apiRequest(`/ai/study-pack/by-isbn/${encodeURIComponent(isbn)}`, {
      method: 'GET',
    })
  },

  evaluateStudyPackQuiz: async ({ studyPackId, answers }) => {
    return apiRequest('/ai/study-pack/evaluate', {
      method: 'POST',
      body: JSON.stringify({ studyPackId, answers }),
    })
  },

  getRecentStudyPacks: async () => {
    return apiRequest('/ai/study-pack/recent', {
      method: 'GET',
    })
  },
}



