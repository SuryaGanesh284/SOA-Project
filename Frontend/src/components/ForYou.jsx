import { useEffect, useState } from 'react'
import { recommendationApi } from '../services/api.js'

const fallbackSuggestions = [
  { title: 'Deep Work', author: 'Cal Newport', rating: 5, swatch: 'from-sky-400 to-blue-800', reason: "Scholar's Pick" },
  { title: 'Atomic Habits', author: 'James Clear', rating: 4, swatch: 'from-amber-300 to-orange-700', reason: 'Popular in Psychology' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 5, swatch: 'from-slate-400 to-slate-800', reason: 'High Affinity' },
  { title: 'The Art of Computer Programming', author: 'Donald Knuth', rating: 5, swatch: 'from-rose-400 to-red-900', reason: 'Classic Reference' },
  { title: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', rating: 4, swatch: 'from-emerald-400 to-teal-800', reason: 'Logic & Math' },
]

function ForYou({ onOpen, user }) {
  const [recommendations, setRecommendations] = useState(fallbackSuggestions)
  const [loading, setLoading] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState(null)

  const userId = user?.userId || user?.id || 'USR-101'

  async function loadRecommendations() {
    try {
      setLoading(true)
      const res = await recommendationApi.getMyRecommendations(userId, 4)
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setRecommendations(res.data)
        setRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      }
    } catch (e) {
      console.warn('Using fallback recommendations due to offline/network state:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [userId])

  return (
    <section aria-label="For you" className="relative">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-ink">For you</h2>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            AI Personalized
          </span>
        </div>
        <button
          type="button"
          onClick={loadRecommendations}
          disabled={loading}
          className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-ink disabled:opacity-50"
          title="Recalculate recommendations from circulation affinity"
        >
          <svg className={`size-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? 'Refreshing...' : refreshedAt ? `Refreshed ${refreshedAt}` : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {recommendations.slice(0, 4).map((book) => (
          <button
            key={book.title}
            type="button"
            onClick={() => onOpen(book.title)}
            className="group flex flex-col text-left transition-transform hover:-translate-y-1"
          >
            <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br ${book.swatch || 'from-sky-400 to-blue-800'} shadow-xs transition-shadow group-hover:shadow-md`}>
              {book.reason && (
                <div className="absolute inset-x-2 top-2">
                  <span className="inline-block max-w-full truncate rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-slate-800 shadow-xs backdrop-blur-xs">
                    {book.reason}
                  </span>
                </div>
              )}
            </div>
            <h3 className="mt-2.5 truncate text-sm font-semibold text-ink group-hover:text-primary">{book.title}</h3>
            <p className="truncate text-xs text-muted">{book.author}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <p className="text-xs tracking-wide text-amber-400" aria-label={`${book.rating} out of 5 stars`}>
                {'★'.repeat(book.rating || 5)}
                <span className="text-slate-200">{'★'.repeat(5 - (book.rating || 5))}</span>
              </p>
              {book.affinityScore && (
                <span className="text-[10px] font-mono text-slate-400">
                  {Math.round(book.affinityScore)}pts
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ForYou
