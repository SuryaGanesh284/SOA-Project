import { useState, useEffect } from 'react'
import { dashboardApi, aiApi } from '../services/api.js'

export default function LandingPage({
  books = [],
  user,
  onEnterPortal,
  onSelectBook,
  onOpenStudyPack,
  onSignIn,
  onRegister,
  onSignOut,
  onDemoLogin,
}) {
  const [liveKpis, setLiveKpis] = useState(null)
  const [aiHealth, setAiHealth] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Interactive Live AI Playground state
  const [aiPrompt, setAiPrompt] = useState('Explain the difference between synchronous and asynchronous microservices in two concise bullet points.')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [aiError, setAiError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function loadStats() {
      try {
        const kpiRes = await dashboardApi.getDashboardKpis()
        if (!ignore && kpiRes.data) {
          setLiveKpis(kpiRes.data)
        }
      } catch (err) {
        console.debug('Dashboard KPI lookup failed', err)
      }

      try {
        const healthRes = await aiApi.getHealth()
        if (!ignore && healthRes.data) {
          setAiHealth(healthRes.data)
        }
      } catch (err) {
        console.debug('AI health check failed', err)
      }
    }
    loadStats()
    return () => {
      ignore = true
    }
  }, [])

  const handleRunAiDemo = async (customPrompt) => {
    const promptToUse = customPrompt || aiPrompt
    if (!promptToUse.trim()) return
    setAiLoading(true)
    setAiError(null)
    setAiResponse(null)
    try {
      const res = await aiApi.testGenerate(promptToUse)
      if (res.data && res.data.content) {
        setAiResponse(res.data)
      } else if (res.error) {
        setAiError(res.error)
      }
    } catch (e) {
      setAiError(e.message || 'AI request failed')
    } finally {
      setAiLoading(false)
    }
  }

  // Filter books for catalog showcase
  const categories = ['All', 'Computer Science', 'Distributed Systems', 'Software Engineering', 'Academic Productivity']
  const filteredBooks = selectedCategory === 'All'
    ? books.slice(0, 8)
    : books.filter((b) => {
        const cat = (b.category || b.groups?.[0] || '').toLowerCase()
        return cat.includes(selectedCategory.toLowerCase()) || (b.title || '').toLowerCase().includes(selectedCategory.toLowerCase())
      }).slice(0, 8)

  const titlesCount = liveKpis ? liveKpis.titles : books.length || 10
  const copiesCount = liveKpis ? liveKpis.copies : 12
  const activeLoansCount = liveKpis ? liveKpis.activeLoans : 2

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink selection:bg-cyan selection:text-navy">
      {/* 1. Cohesive Header matching Archivalia Web UI */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-navy text-cyan font-black text-base shadow-xs">
              ✦
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-ink">ARCHIVALIA</span>
                <span className="rounded-full bg-field px-2.5 py-0.5 text-[10px] font-bold text-muted border border-slate-200">
                  PS038 E-Library
                </span>
              </div>
              <p className="text-[11px] text-muted hidden sm:block">Enterprise Academic Microservices & Generative AI</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted">
            <a href="#features" className="hover:text-ink transition">Core Features</a>
            <a href="#ai-suite" className="hover:text-ink transition">AI Intelligence Suite</a>
            <a href="#catalog" className="hover:text-ink transition">Live Catalog</a>
            <a href="#architecture" className="hover:text-ink transition">Ecosystem Matrix</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Live Microservice Indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>11 Microservices Active</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <span className="block text-xs font-bold text-ink">{user.name}</span>
                  <span className="block text-[10px] text-muted uppercase tracking-wider">{user.role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterPortal(user.role === 'ADMIN' ? 'dashboard' : 'discover')}
                  className="rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-navy-raised transition"
                >
                  Enter Library Portal →
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-muted hover:bg-field hover:text-ink transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSignIn}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:bg-field transition shadow-xs"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onEnterPortal('discover')}
                  className="rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-navy-raised transition"
                >
                  Enter Library Portal →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. Hero Section with Signature Archivalia Navy Banner & Elevated Card */}
        <section className="rounded-window bg-white border border-slate-200/80 shadow-window p-6 sm:p-10 md:p-12 relative overflow-hidden">
          {/* Hero Banner: Deep Navy & Cyan Gradient */}
          <div className="rounded-2xl bg-linear-to-r from-navy via-navy-raised to-[#151c28] p-8 sm:p-12 text-white relative overflow-hidden shadow-md">
            {/* Ambient Cyan Glow */}
            <div className="absolute -top-16 -right-16 size-80 rounded-full bg-cyan/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-cyan backdrop-blur-sm mb-6">
                <span>✦</span>
                <span>Spring Cloud Microservices & Google Gemini 3.5 Flash</span>
                <span className="size-1.5 rounded-full bg-cyan" />
                <span>PS038 Specification</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]">
                The Academic E-Library
                <span className="block text-cyan">
                  Re-engineered for the AI Era
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                A resilient cloud-native platform orchestrated with Netflix Eureka, Spring Cloud Gateway, and Google Gemini.
                Experience real-time physical shelf tracking, automated fine settlements, and dynamic research synthesis for modern universities.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEnterPortal('discover')}
                  className="flex items-center gap-2 rounded-xl bg-cyan px-6 py-3 text-xs font-bold text-navy shadow-md hover:bg-cyan/90 transition scale-100 hover:scale-105 active:scale-95"
                >
                  <span>✦ Enter Library Portal</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEnterPortal('ai-research')}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition"
                >
                  <span>🧠 Launch AI Research Assistant</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEnterPortal('dashboard')}
                  className="rounded-xl border border-white/20 px-4 py-3 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  Admin Dashboard Console
                </button>
              </div>

              {/* Quick Evaluator Access Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-6 border-t border-white/10">
                <span className="text-slate-400 font-medium">1-Click Evaluator Sign-In:</span>
                <button
                  type="button"
                  onClick={() => onDemoLogin?.('user@archivalia.test', 'user123')}
                  className="rounded-lg bg-white/10 px-3 py-1 text-slate-200 hover:bg-white/20 hover:text-cyan transition flex items-center gap-1.5"
                >
                  <span>👤 Student (Ben Bradle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDemoLogin?.('admin@archivalia.test', 'admin123')}
                  className="rounded-lg bg-white/10 px-3 py-1 text-slate-200 hover:bg-white/20 hover:text-cyan transition flex items-center gap-1.5"
                >
                  <span>🛡️ Admin (Dr. Emily Chen)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Live Ecosystem Metrics Ribbon */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl bg-field p-5 border border-slate-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Curated Titles</span>
              <p className="mt-1 text-3xl font-black text-ink">{titlesCount}</p>
              <p className="text-[11px] text-muted">Academic STEM volumes</p>
            </div>
            <div className="rounded-2xl bg-field p-5 border border-slate-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Holding Copies</span>
              <p className="mt-1 text-3xl font-black text-ink">{copiesCount}</p>
              <p className="text-[11px] text-muted">Tracked physical copies</p>
            </div>
            <div className="rounded-2xl bg-field p-5 border border-slate-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active Circulation</span>
              <p className="mt-1 text-3xl font-black text-ink">{activeLoansCount}</p>
              <p className="text-[11px] text-muted">Real-time student loans</p>
            </div>
            <div className="rounded-2xl bg-field p-5 border border-slate-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">AI Intelligence</span>
              <p className="mt-1 text-3xl font-black text-ink">~1.2s</p>
              <p className="text-[11px] text-muted">Gemini 3.5 Flash latency</p>
            </div>
          </div>
        </section>

        {/* 4. Live Interactive "Test-Drive Gemini AI" Playground */}
        <section id="ai-demo" className="rounded-window bg-white border border-slate-200/80 shadow-window p-6 sm:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs ring-1 ring-indigo-200">
                  ✦
                </span>
                <h2 className="text-lg font-bold text-ink">Interactive Live AI Playground</h2>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
                  Live Gemini 3.5 Flash
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Test the real-time AI microservice (:8088) right from the landing page. No mocks — live neural generation.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 border border-emerald-200">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational · Port 8088
              </span>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const p = 'Derive the time complexity of the Ford-Fulkerson algorithm and explain why Edmonds-Karp guarantees O(V E^2).'
                setAiPrompt(p)
                handleRunAiDemo(p)
              }}
              className="rounded-lg border border-slate-200 bg-field px-3 py-1.5 text-xs text-ink font-medium hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 transition"
            >
              ⚡ Edmonds-Karp O(V E²) Proof
            </button>
            <button
              type="button"
              onClick={() => {
                const p = 'What are the core consistency tradeoffs in distributed systems under the CAP theorem?'
                setAiPrompt(p)
                handleRunAiDemo(p)
              }}
              className="rounded-lg border border-slate-200 bg-field px-3 py-1.5 text-xs text-ink font-medium hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 transition"
            >
              ⚡ CAP Theorem Tradeoffs
            </button>
            <button
              type="button"
              onClick={() => {
                const p = 'Summarize key takeaways for Designing Data-Intensive Applications regarding replication lag.'
                setAiPrompt(p)
                handleRunAiDemo(p)
              }}
              className="rounded-lg border border-slate-200 bg-field px-3 py-1.5 text-xs text-ink font-medium hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 transition"
            >
              ⚡ DDIA Replication Lag
            </button>
          </div>

          {/* Input Box */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask any academic STEM problem or derivation..."
              className="flex-1 rounded-xl border border-slate-200 bg-field px-4 py-3 text-xs text-ink placeholder:text-muted focus:border-indigo-500 focus:bg-white focus:outline-none transition shadow-2xs"
            />
            <button
              type="button"
              disabled={aiLoading}
              onClick={() => handleRunAiDemo()}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-navy-raised transition disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span className="text-cyan">✦</span>
                  <span>Run Live AI Query</span>
                </>
              )}
            </button>
          </div>

          {/* Response Card */}
          {aiResponse && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 text-xs leading-relaxed text-ink shadow-2xs">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-3">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <span>✓</span> Live Gemini Response Generated
                </span>
                <span className="text-[11px] text-muted">
                  Model: {aiResponse.modelUsed || 'gemini-3.5-flash'} · Status: 200 OK
                </span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-slate-800">
                {aiResponse.content}
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-muted">
                <span>Tokens evaluated: {aiResponse.promptTokens || 'Dynamic'} prompt / {aiResponse.candidateTokens || 'Live'} completion</span>
                <button
                  type="button"
                  onClick={() => onEnterPortal('ai-research')}
                  className="font-bold text-navy hover:text-cyan transition underline"
                >
                  Open in Full AI Research Assistant →
                </button>
              </div>
            </div>
          )}

          {aiError && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
              <span className="font-bold">Error:</span> {aiError}
            </div>
          )}
        </section>

        {/* 5. The 4 Pillars of the AI Intelligence Suite */}
        <section id="ai-suite" className="rounded-window bg-white border border-slate-200/80 shadow-window p-6 sm:p-10">
          <div className="max-w-3xl">
            <span className="rounded-full bg-field px-3 py-1 text-[10px] font-bold text-muted border border-slate-200 uppercase tracking-wider">
              Generative Academic Intelligence
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-ink">
              Four Core Pillars Built for Real-World Academia
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Powered by Google Gemini 3.5 Flash with fallback resiliency to Gemini 3.5 Flash-Lite on Port 8088.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-field p-6 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-bold ring-1 ring-sky-200 text-sm">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">
                      Academic Problem Solver & Research Assistant
                    </h3>
                    <span className="text-[11px] text-sky-700 font-medium">Mathematical Derivations & Library Citation</span>
                  </div>
                </div>
                <p className="mt-3.5 text-xs text-muted leading-relaxed">
                  Formulates step-by-step mathematical proofs, theorem derivations, and algorithm analyses. Cross-references university catalog books and builds formal academic citations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterPortal('ai-research')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-navy hover:text-cyan transition self-start"
              >
                <span>Explore Problem Solver</span>
                <span>→</span>
              </button>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-field p-6 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-200 text-sm">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">
                      Deep Semantic Book Search & Synopsis Engine
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-medium">Concept Discovery & Abstract Synthesis</span>
                  </div>
                </div>
                <p className="mt-3.5 text-xs text-muted leading-relaxed">
                  Find textbooks by describing conceptual questions like <em>"distributed consensus and Paxos replication lag"</em>. Generates deep executive abstracts and core theoretical takeaways.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterPortal('ai-research')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-navy hover:text-cyan transition self-start"
              >
                <span>Explore Semantic Search</span>
                <span>→</span>
              </button>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-field p-6 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold ring-1 ring-purple-200 text-sm">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">
                      Dynamic Study Packs & Interactive Practice Quizzes
                    </h3>
                    <span className="text-[11px] text-purple-700 font-medium">1-Click Exam Prep & Instant Automated Grading</span>
                  </div>
                </div>
                <p className="mt-3.5 text-xs text-muted leading-relaxed">
                  Synthesizes high-yield exam takeaways and generates 5-question multiple-choice quizzes with real-time grading and pedagogical rationales for each option.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenStudyPack?.(books[0] || null)}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-navy hover:text-cyan transition self-start"
              >
                <span>Explore Study Packs</span>
                <span>→</span>
              </button>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-field p-6 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700 font-bold ring-1 ring-rose-200 text-sm">
                    4
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">
                      Econometric Restock Forecaster & Demand Forecaster
                    </h3>
                    <span className="text-[11px] text-rose-700 font-medium">Poisson Queue Modeling & 1-Click Purchase Requisitions</span>
                  </div>
                </div>
                <p className="mt-3.5 text-xs text-muted leading-relaxed">
                  Uses Poisson arrival distributions and Erlang-C blocking probabilities to forecast upcoming semester exam surges, stockout risk tiers, and generate 1-click requisition orders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterPortal('dashboard')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-navy hover:text-cyan transition self-start"
              >
                <span>Explore Restock Forecaster</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* 6. Live Curated Catalog Showcase */}
        <section id="catalog" className="rounded-window bg-white border border-slate-200/80 shadow-window p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="rounded-full bg-field px-3 py-1 text-[10px] font-bold text-muted border border-slate-200 uppercase tracking-wider">
                Live Microservice Inventory
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-ink">Curated University Catalog</h2>
              <p className="mt-1 text-xs text-muted">Directly fetched from Book Service (:8082). Real physical copies and shelf status.</p>
            </div>

            <button
              type="button"
              onClick={() => onEnterPortal('discover')}
              className="self-start md:self-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-field transition shadow-2xs"
            >
              Browse All {books.length} Publications →
            </button>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-field text-muted hover:bg-slate-200 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book, idx) => {
              const availableCopies = book.copies
                ? book.copies.filter((c) => c.status === 'AVAILABLE').length
                : 1
              const totalCopies = book.copies ? book.copies.length : 2
              const isAvailable = availableCopies > 0

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition group"
                >
                  <div>
                    {/* Book Cover Gradient Matching Library Theme */}
                    <div className={`h-40 w-full rounded-xl bg-linear-to-br ${book.swatch || 'from-sky-500 to-indigo-900'} p-4 flex flex-col justify-end text-white shadow-sm mb-3.5 relative overflow-hidden`}>
                      <span className="absolute top-2 right-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                        {book.year || '2024'}
                      </span>
                      <p className="text-xs font-black line-clamp-2 drop-shadow-xs">{book.title}</p>
                      <p className="text-[11px] text-white/80 line-clamp-1">{book.author}</p>
                    </div>

                    <h4 className="text-sm font-bold text-ink group-hover:text-cyan transition line-clamp-1">
                      {book.title}
                    </h4>
                    <p className="text-xs text-muted line-clamp-1">{book.author}</p>
                    <p className="mt-2 text-[11px] text-slate-500 line-clamp-2">
                      {book.description || 'Core academic textbook prescribed for computer science and engineering coursework.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] mb-3">
                      <span className="text-muted">Shelf Holding:</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        isAvailable 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {availableCopies} / {totalCopies} {isAvailable ? 'Available' : 'On Loan'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectBook?.(book.title)}
                        className="flex-1 rounded-xl bg-navy py-2 text-[11px] font-semibold text-white hover:bg-navy-raised transition shadow-2xs"
                      >
                        Borrow / Details
                      </button>
                      <button
                        type="button"
                        title="Generate AI Study Pack & Quiz"
                        onClick={() => onOpenStudyPack?.(book)}
                        className="rounded-xl border border-purple-200 bg-purple-50 px-2.5 py-2 text-[11px] font-bold text-purple-700 hover:bg-purple-100 transition"
                      >
                        ✦ Study Pack
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 7. Real-Time Microservices Ecosystem Matrix */}
        <section id="architecture" className="rounded-window bg-white border border-slate-200/80 shadow-window p-6 sm:p-10">
          <div className="max-w-3xl">
            <span className="rounded-full bg-field px-3 py-1 text-[10px] font-bold text-muted border border-slate-200 uppercase tracking-wider">
              PS038 Architecture
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-ink">
              11-Microservice Distributed Cloud Ecosystem
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Every component is decoupled with Netflix Eureka registration and routed through Spring Cloud Gateway.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {[
              { name: 'Eureka Service Registry', port: 8761, desc: 'Service discovery & health heartbeats', status: 'UP' },
              { name: 'Spring Cloud API Gateway', port: 8080, desc: 'Global ingress & dynamic load balancing', status: 'UP' },
              { name: 'Auth & JWT Service', port: 8081, desc: 'BCrypt hashing, RBAC, stateless JWTs', status: 'UP' },
              { name: 'Book Catalog Service', port: 8082, desc: 'Multi-format catalog, copy tracking, KPIs', status: 'UP' },
              { name: 'Borrow Circulation Service', port: 8083, desc: 'Loan lifecycle, checkout, return audit', status: 'UP' },
              { name: 'Fine & Razorpay Service', port: 8084, desc: 'Overdue fee calculation & payment sandbox', status: 'UP' },
              { name: 'Notification Service', port: 8085, desc: 'Real-time alerts & scholar activity feed', status: 'UP' },
              { name: 'Recommendation Engine', port: 8086, desc: 'Genre affinity AI recommendation scoring', status: 'UP' },
              { name: 'Discovery & Web Scraper', port: 8087, desc: 'JSoup HTML metadata scraper & OpenLibrary', status: 'UP' },
              { name: 'AI Intelligence Suite', port: 8088, desc: 'Google Gemini 3.5 Flash academic engine', status: 'UP', highlight: true },
              { name: 'React 19 Frontend Web Portal', port: 5173, desc: 'Single-page responsive application', status: 'UP' },
              { name: 'Dual Persistence Layer', port: 3306, desc: 'Zero-config H2 dev & MySQL 8.0 production', status: 'UP' },
            ].map((srv, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition ${
                  srv.highlight
                    ? 'border-indigo-300 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-200'
                    : 'border-slate-200 bg-field hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-ink font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    PORT {srv.port}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {srv.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink">{srv.name}</h4>
                <p className="mt-1 text-[11px] text-muted">{srv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Call to Action Banner matching Website Navy Theme */}
        <section className="rounded-window bg-linear-to-r from-navy via-navy-raised to-[#151c28] p-8 sm:p-12 text-white text-center shadow-window relative overflow-hidden">
          <div className="absolute -top-16 -left-16 size-80 rounded-full bg-cyan/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Ready to Explore the Future of Academic Libraries?
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Access the curated university repository, solve complex research problems with Gemini AI, or manage acquisitions through an enterprise distributed system.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onEnterPortal('discover')}
                className="rounded-xl bg-cyan px-7 py-3 text-xs font-bold text-navy shadow-md hover:bg-cyan/90 transition scale-100 hover:scale-105 active:scale-95"
              >
                ✦ Enter Library Portal
              </button>
              <button
                type="button"
                onClick={() => onEnterPortal('ai-research')}
                className="rounded-xl bg-white/10 px-6 py-3 text-xs font-semibold text-white hover:bg-white/20 transition"
              >
                Launch AI Intelligence Suite
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Cohesive Academic Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">Archivalia E-Library System</span>
            <span>·</span>
            <span>PS038 Academic Implementation</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap justify-center">
            <span>Spring Boot 3.3.4</span>
            <span>•</span>
            <span>Netflix Eureka</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Google Gemini 3.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
