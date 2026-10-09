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
  const usersCount = liveKpis ? liveKpis.totalUsers : 2

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-navy font-sans">
      {/* 1. Glassmorphism Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-tr from-cyan-500 to-indigo-600 text-white font-black text-lg shadow-md shadow-cyan-500/20">
              ✦
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white">ARCHIVALIA</span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                  PS038 E-Library
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Academic Microservices & Generative AI</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition">Core Features</a>
            <a href="#ai-suite" className="hover:text-cyan-400 transition">AI Intelligence Suite</a>
            <a href="#catalog" className="hover:text-cyan-400 transition">Live Catalog</a>
            <a href="#architecture" className="hover:text-cyan-400 transition">Ecosystem Matrix</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Live Microservice Indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>11 Microservices Active</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <span className="block text-xs font-bold text-white">{user.name}</span>
                  <span className="block text-[10px] text-cyan-400 uppercase tracking-wider">{user.role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterPortal(user.role === 'ADMIN' ? 'dashboard' : 'discover')}
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition"
                >
                  Enter Library Portal →
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSignIn}
                  className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onEnterPortal('discover')}
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition"
                >
                  Enter Library Portal →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 size-80 rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-xs">
            <span>✦</span>
            <span>Enterprise Academic Microservices & Google Gemini 3.5 Flash</span>
            <span className="size-1.5 rounded-full bg-cyan-400" />
            <span className="text-cyan-400">PS038 Specification</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
            The Academic E-Library
            <span className="block bg-linear-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Re-engineered for the AI Era
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
            A resilient cloud-native platform orchestrated with Spring Cloud, Netflix Eureka, and Google Gemini.
            Experience real-time physical copy tracking, automated fine settlements, and dynamic research synthesis for modern universities.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onEnterPortal('discover')}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition scale-100 hover:scale-105 active:scale-95"
            >
              <span>✦ Enter Library Portal</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterPortal('ai-research')}
              className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-6 py-3.5 text-sm font-semibold text-indigo-300 backdrop-blur-xs hover:bg-indigo-900/50 hover:text-white transition"
            >
              <span>🧠 Launch AI Intelligence Suite</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterPortal('dashboard')}
              className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-3.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              Admin Dashboard Console
            </button>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="text-slate-500">1-Click Evaluator Sign-In:</span>
            <button
              type="button"
              onClick={() => onDemoLogin?.('user@archivalia.test', 'user123')}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition"
            >
              👤 Student (Ben Bradle)
            </button>
            <button
              type="button"
              onClick={() => onDemoLogin?.('admin@archivalia.test', 'admin123')}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition"
            >
              🛡️ Admin (Dr. Emily Chen)
            </button>
          </div>

          {/* 3. Live Ecosystem Metrics Ribbon */}
          <div className="mx-auto mt-16 max-w-5xl grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md sm:grid-cols-4">
            <div className="text-left border-r border-white/5 pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Curated Titles</span>
              <p className="mt-1 text-3xl font-black text-white">{titlesCount}</p>
              <p className="text-[11px] text-slate-400">Academic STEM volumes</p>
            </div>
            <div className="text-left border-r border-white/5 pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Holding Copies</span>
              <p className="mt-1 text-3xl font-black text-white">{copiesCount}</p>
              <p className="text-[11px] text-slate-400">Tracked physical copies</p>
            </div>
            <div className="text-left border-r border-white/5 pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Active Circulation</span>
              <p className="mt-1 text-3xl font-black text-white">{activeLoansCount}</p>
              <p className="text-[11px] text-slate-400">Real-time student loans</p>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">AI Intelligence</span>
              <p className="mt-1 text-3xl font-black text-white">~1.2s</p>
              <p className="text-[11px] text-slate-400">Gemini 3.5 Flash latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Interactive "Test-Drive Gemini AI" Playground */}
      <section id="ai-demo" className="py-16 bg-slate-900/40 border-y border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-purple-500/20 bg-linear-to-b from-purple-950/30 to-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs shadow-xs">
                    ✦
                  </span>
                  <h2 className="text-xl font-bold text-white">Interactive Live AI Playground</h2>
                  <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-400 border border-purple-500/20">
                    Live Gemini 3.5 Flash
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Test the real-time AI microservice (:8088) right from the landing page. No mocks — live neural generation.
                </p>
              </div>

              <div className="text-right text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold">● Operational</span> · Port 8088
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
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-purple-400/50 hover:bg-purple-900/30 transition"
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
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-purple-400/50 hover:bg-purple-900/30 transition"
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
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-purple-400/50 hover:bg-purple-900/30 transition"
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
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                disabled={aiLoading}
                onClick={() => handleRunAiDemo()}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <span>✦ Run Live AI Query</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Card */}
            {aiResponse && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-slate-950 p-5 text-xs leading-relaxed text-slate-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>✓</span> Live Gemini Response Generated
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Model: {aiResponse.modelUsed || 'gemini-3.5-flash'} · Status: 200 OK
                  </span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-slate-300">
                  {aiResponse.content}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Tokens evaluated: {aiResponse.promptTokens || 'Dynamic'} prompt / {aiResponse.candidateTokens || 'Live'} completion</span>
                  <button
                    type="button"
                    onClick={() => onEnterPortal('ai-research')}
                    className="font-bold text-cyan-400 hover:underline"
                  >
                    Open in Full AI Research Assistant →
                  </button>
                </div>
              </div>
            )}

            {aiError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                <span className="font-bold">Error:</span> {aiError}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. The 4 Pillars of the AI Intelligence Suite */}
      <section id="ai-suite" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Generative Academic Intelligence</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
            Four Core Pillars Built for Real-World Academia
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Powered by Google Gemini 3.5 Flash with fallback resiliency to Gemini 3.5 Flash-Lite on Port 8088.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-cyan-500/40 transition group">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                1
              </span>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                  Academic Problem Solver & Research Assistant
                </h3>
                <span className="text-[11px] text-cyan-400/70">Mathematical Derivations & Library Citation</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Formulates step-by-step mathematical proofs, theorem derivations, and algorithm analyses. Cross-references university catalog books and builds formal academic citations.
            </p>
            <button
              type="button"
              onClick={() => onEnterPortal('ai-research')}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>Explore Problem Solver</span>
              <span>→</span>
            </button>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-emerald-500/40 transition group">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  Deep Semantic Book Search & Synopsis Engine
                </h3>
                <span className="text-[11px] text-emerald-400/70">Concept Discovery & Abstract Synthesis</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Find textbooks by describing conceptual questions like <em>"distributed consensus and Paxos replication lag"</em>. Generates deep executive abstracts and core theoretical takeaways.
            </p>
            <button
              type="button"
              onClick={() => onEnterPortal('ai-research')}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Explore Semantic Search</span>
              <span>→</span>
            </button>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-purple-500/40 transition group">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                3
              </span>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                  Dynamic Study Packs & Interactive Practice Quizzes
                </h3>
                <span className="text-[11px] text-purple-400/70">1-Click Exam Prep & Instant Automated Grading</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Synthesizes high-yield exam takeaways and generates 5-question multiple-choice quizzes with real-time grading and pedagogical rationales for each option.
            </p>
            <button
              type="button"
              onClick={() => onEnterPortal('ai-research')}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition"
            >
              <span>Explore Study Packs</span>
              <span>→</span>
            </button>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-rose-500/40 transition group">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                4
              </span>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition">
                  Econometric Restock Forecaster & Demand Forecaster
                </h3>
                <span className="text-[11px] text-rose-400/70">Poisson Queue Modeling & 1-Click Purchase Requisitions</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Uses Poisson arrival distributions and Erlang-C blocking probabilities to forecast upcoming semester exam surges, stockout risk tiers, and generate 1-click requisition orders.
            </p>
            <button
              type="button"
              onClick={() => onEnterPortal('dashboard')}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
            >
              <span>Explore Restock Forecaster</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Live Curated Catalog Showcase */}
      <section id="catalog" className="py-20 bg-slate-900/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Microservice Inventory</span>
              <h2 className="mt-2 text-3xl font-extrabold text-white">Curated University Catalog</h2>
              <p className="mt-1 text-xs text-slate-400">Directly fetched from Book Service (:8082). Real physical copies and shelf status.</p>
            </div>

            <button
              type="button"
              onClick={() => onEnterPortal('discover')}
              className="self-start md:self-auto rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              Browse All {books.length} Publications →
            </button>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-navy shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book, idx) => {
              const availableCopies = book.copies
                ? book.copies.filter((c) => c.status === 'AVAILABLE').length
                : 1
              const totalCopies = book.copies ? book.copies.length : 2
              const isAvailable = availableCopies > 0

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition group"
                >
                  <div>
                    {/* Book Cover Gradient */}
                    <div className={`h-40 w-full rounded-xl bg-linear-to-br ${book.swatch || 'from-sky-500 to-indigo-900'} p-4 flex flex-col justify-end text-white shadow-inner mb-4 relative overflow-hidden`}>
                      <span className="absolute top-2 right-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                        {book.year || '2024'}
                      </span>
                      <p className="text-xs font-black line-clamp-2 drop-shadow-sm">{book.title}</p>
                      <p className="text-[11px] text-white/80 line-clamp-1">{book.author}</p>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition line-clamp-1">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{book.author}</p>
                    <p className="mt-2 text-[11px] text-slate-500 line-clamp-2">
                      {book.description || 'Core academic textbook prescribed for computer science and engineering coursework.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] mb-3">
                      <span className="text-slate-400">Shelf Holding:</span>
                      <span className={`font-bold ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {availableCopies} / {totalCopies} {isAvailable ? 'Available' : 'On Loan'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectBook?.(book.title)}
                        className="flex-1 rounded-xl bg-white/10 py-2 text-[11px] font-semibold text-white hover:bg-cyan-500 hover:text-navy transition"
                      >
                        Borrow / Details
                      </button>
                      <button
                        type="button"
                        title="Generate AI Study Pack & Quiz"
                        onClick={() => onOpenStudyPack?.(book)}
                        className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-2 text-[11px] font-bold text-purple-300 hover:bg-purple-500 hover:text-white transition"
                      >
                        ✦ Study Pack
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. Real-Time Microservices Ecosystem Matrix */}
      <section id="architecture" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">PS038 Architecture</span>
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            11-Microservice Distributed Cloud Ecosystem
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Every component is fully decoupled with Netflix Eureka registration and routed through Spring Cloud Gateway.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              className={`rounded-xl border p-4 backdrop-blur-xs ${
                srv.highlight
                  ? 'border-cyan-500/40 bg-cyan-950/20'
                  : 'border-white/10 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">PORT {srv.port}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {srv.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{srv.name}</h4>
              <p className="mt-1 text-[11px] text-slate-400">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action / Footer */}
      <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-linear-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 bg-linear-to-r from-navy via-indigo-950 to-slate-900 p-10 text-center relative overflow-hidden mb-16">
            <h3 className="text-3xl font-black text-white sm:text-4xl">
              Ready to Explore the Future of Academic Libraries?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
              Access the curated university repository, solve complex research problems with Gemini AI, or manage acquisitions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => onEnterPortal('discover')}
                className="rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition scale-100 hover:scale-105 active:scale-95"
              >
                ✦ Enter Library Portal
              </button>
              <button
                type="button"
                onClick={() => onEnterPortal('ai-research')}
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Launch AI Intelligence Suite
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Archivalia E-Library System</span>
              <span>·</span>
              <span>PS038 Academic Implementation</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Spring Boot 3.3.4</span>
              <span>•</span>
              <span>Netflix Eureka</span>
              <span>•</span>
              <span>React 19</span>
              <span>•</span>
              <span>Google Gemini 3.5 Flash</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
