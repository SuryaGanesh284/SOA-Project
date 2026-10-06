import React, { useState, useEffect } from 'react'
import { aiApi } from '../services/api'

const PRESET_QUERIES = [
  {
    title: 'Backpropagation Derivation',
    field: 'Computer Science & AI',
    level: 'Postgraduate',
    query: 'How does the Backpropagation algorithm compute gradients for deep convolutional neural networks? Provide the mathematical chain rule derivation and matrix formulation.',
  },
  {
    title: 'Ford-Fulkerson O(V E²) Proof',
    field: 'Algorithms & Complexity',
    level: 'Undergraduate',
    query: 'Derive the time complexity of the Ford-Fulkerson algorithm and prove why the Edmonds-Karp modification guarantees O(V E^2) runtime.',
  },
  {
    title: 'CAP Theorem Proof & Tradeoffs',
    field: 'Distributed Systems',
    level: 'Postgraduate',
    query: 'Formulate Gilbert and Lynch\'s formal proof of the CAP theorem and analyze real-world consistency tradeoffs in distributed database consensus.',
  },
  {
    title: 'Quantum Decoherence',
    field: 'Physics & Quantum Computing',
    level: 'PhD / Research',
    query: 'Explain the mechanism of quantum decoherence and density matrix off-diagonal decay in open quantum systems versus wave function collapse.',
  },
]

const PRESET_SEMANTIC_QUERIES = [
  'Books explaining distributed consensus, Paxos, Raft, and replication lag under network partitions',
  'Foundational texts on interpreters, recursion, computational abstraction, and metalinguistic models',
  'Software architecture and craftsmanship principles for writing maintainable and testable code',
  'Cognitive psychology, user mental models, affordances, and human-centered product design',
]

const ACADEMIC_FIELDS = [
  'Computer Science & AI',
  'Algorithms & Complexity',
  'Distributed Systems',
  'Mathematics & Statistics',
  'Physics & Astronomy',
  'Electrical Engineering',
  'Biomedical & Life Sciences',
  'Economics & Quantitative Finance',
  'General Academic & STEM',
]

const DIFFICULTY_LEVELS = [
  'Undergraduate',
  'Postgraduate',
  'PhD / Research',
]

export default function AiResearchAssistant({ user, onSearchKeyword }) {
  const [activeTab, setActiveTab] = useState('solve') // 'solve' | 'semantic'

  // Feature 1 State (Research Solver)
  const [query, setQuery] = useState('')
  const [academicField, setAcademicField] = useState('Computer Science & AI')
  const [difficultyLevel, setDifficultyLevel] = useState('Postgraduate')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [elapsedSecs, setElapsedSecs] = useState(0)

  // Feature 2 State (Semantic Search & Synopsis)
  const [semanticQuery, setSemanticQuery] = useState('')
  const [semanticLoading, setSemanticLoading] = useState(false)
  const [semanticResult, setSemanticResult] = useState(null)
  const [semanticError, setSemanticError] = useState(null)
  const [selectedSynopsis, setSelectedSynopsis] = useState(null)
  const [synopsisLoading, setSynopsisLoading] = useState(false)

  // Shared State
  const [healthStatus, setHealthStatus] = useState(null)

  const userId = user?.id || user?.email || 'scholar'

  useEffect(() => {
    checkHealth()
    loadHistory()
  }, [])

  useEffect(() => {
    let timer
    if (loading || semanticLoading || synopsisLoading) {
      setElapsedSecs(0)
      timer = setInterval(() => {
        setElapsedSecs((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [loading, semanticLoading, synopsisLoading])

  const checkHealth = async () => {
    const res = await aiApi.getHealth()
    if (res.data) setHealthStatus(res.data)
  }

  const loadHistory = async () => {
    const res = await aiApi.getResearchHistory(userId)
    if (res.data && Array.isArray(res.data)) setHistory(res.data)
  }

  // Feature 1 Submit
  const handleSolveSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await aiApi.submitResearchQuery({
        query: query.trim(),
        academicField,
        difficultyLevel,
        userId,
      })

      if (res.error) {
        setError(res.error)
      } else if (res.data) {
        setResult(res.data)
        loadHistory()
      }
    } catch (err) {
      setError(err.message || 'Failed to generate research solution')
    } finally {
      setLoading(false)
    }
  }

  // Feature 2 Semantic Search Submit
  const handleSemanticSearchSubmit = async (e, customQuery) => {
    if (e) e.preventDefault()
    const q = customQuery || semanticQuery
    if (!q.trim()) return

    if (customQuery) setSemanticQuery(customQuery)

    setSemanticLoading(true)
    setSemanticError(null)

    try {
      const res = await aiApi.semanticSearch(q.trim(), null, 4)
      if (res.error) {
        setSemanticError(res.error)
      } else if (res.data) {
        setSemanticResult(res.data)
      }
    } catch (err) {
      setSemanticError(err.message || 'Failed to perform semantic search')
    } finally {
      setSemanticLoading(false)
    }
  }

  // Fetch or generate synopsis for a specific book
  const handleFetchSynopsis = async (book) => {
    setSynopsisLoading(true)
    try {
      const res = await aiApi.getSynopsis({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        category: book.category || '',
      })
      if (res.data) {
        setSelectedSynopsis(res.data)
      }
    } catch (err) {
      console.error('Failed to fetch synopsis', err)
    } finally {
      setSynopsisLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50/60 p-6">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-linear-to-r from-navy via-indigo-950 to-slate-900 p-6 text-white shadow-lg md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
              ✦
            </span>
            <h1 className="text-xl font-bold tracking-tight">Archivalia AI Intelligence Suite</h1>
          </div>
          <p className="mt-2 text-xs text-slate-300 md:text-sm">
            Autonomous microservice powered by live Google Gemini 3.5. Real-time academic derivations, deep conceptual catalog search, and comprehensive book synopses.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            <span className={`size-2 rounded-full ${healthStatus?.status === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{healthStatus ? `Model: ${healthStatus.configuredModel || 'gemini-3.5-flash'}` : 'Connecting...'}</span>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs text-slate-300">
            Port 8088
          </div>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="mb-6 flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('solve')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition ${
            activeTab === 'solve'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>✦ Academic Problem Solver</span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700">Feature 1</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('semantic')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition ${
            activeTab === 'semantic'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>🔍 Deep Semantic Search & Synopses</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-medium">Feature 2</span>
        </button>
      </div>

      {/* TAB 1: ACADEMIC PROBLEM SOLVER */}
      {activeTab === 'solve' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Presets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Academic Prompts</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PRESET_QUERIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(preset.query)
                      setAcademicField(preset.field)
                      setDifficultyLevel(preset.level)
                    }}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
                  >
                    <p className="text-xs font-semibold text-slate-800">{preset.title}</p>
                    <span className="mt-1 inline-block rounded-md bg-white px-1.5 py-0.5 text-[10px] text-slate-500 ring-1 ring-slate-200">
                      {preset.field}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSolveSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Academic Field</label>
                  <select
                    value={academicField}
                    onChange={(e) => setAcademicField(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {ACADEMIC_FIELDS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Difficulty Level</label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {DIFFICULTY_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Research Question / Problem Statement</label>
                <textarea
                  rows={5}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter mathematical problem, algorithmic derivation, literature review question, or engineering concept..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deriving with Gemini AI ({elapsedSecs}s)...</span>
                  </>
                ) : (
                  <>
                    <span>✦ Solve & Formulate Solution</span>
                  </>
                )}
              </button>

              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                  {error}
                </div>
              )}
            </form>

            {/* History */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recent Research Inquiries ({history.length})
                </h3>
                <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResult(item)}
                      className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/30"
                    >
                      <p className="line-clamp-2 text-xs font-medium text-slate-800">{item.query}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{item.academicField}</span>
                        <span>•</span>
                        <span>{item.difficultyLevel}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (7 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            {loading ? (
              <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                <div className="size-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-slate-800">Generating Academic Solution...</p>
                <p className="mt-1 text-xs text-slate-500">Gemini 3.5 Flash is executing step-by-step calculus derivations and textbook cross-referencing ({elapsedSecs}s elapsed)</p>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-5">
                {/* Executive Summary */}
                <div className="rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50/70 via-white to-purple-50/40 p-5 shadow-xs">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                      Executive Academic Summary
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Model: {result.modelUsed} • Tokens: {result.promptTokens + result.candidateTokens}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {result.executiveSummary}
                  </p>
                </div>

                {/* Mathematical Formulations */}
                {result.mathematicalFormulations && result.mathematicalFormulations.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                      <span className="text-indigo-600">∑</span> Core Mathematical & Algorithmic Formulations
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {result.mathematicalFormulations.map((formula, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 font-mono text-xs text-indigo-950">
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step-by-Step Formal Solution */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Step-by-Step Analytical Breakdown & Derivation
                  </h3>
                  <div className="prose prose-xs sm:prose-sm max-w-none whitespace-pre-line text-xs leading-relaxed text-slate-800">
                    {result.stepByStepSolution}
                  </div>
                </div>

                {/* Real-World Applications */}
                {result.realWorldApplications && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Practical Industry & Research Applications
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                      {result.realWorldApplications}
                    </p>
                  </div>
                )}

                {/* Recommended Textbooks */}
                {result.recommendedTextbooks && result.recommendedTextbooks.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Recommended Textbooks & Literature
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {result.recommendedTextbooks.map((book, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs text-slate-800">
                          <span className="text-amber-500">📖</span>
                          <span>{book}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Search Keywords */}
                {result.recommendedSearchKeywords && result.recommendedSearchKeywords.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Related Archivalia Catalog Search Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.recommendedSearchKeywords.map((kw, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onSearchKeyword && onSearchKeyword(kw)}
                          className="rounded-lg border border-indigo-200 bg-indigo-50/50 px-2.5 py-1 text-xs text-indigo-700 transition hover:bg-indigo-100"
                        >
                          🔍 {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-Up Questions */}
                {result.followUpResearchQuestions && result.followUpResearchQuestions.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Curated Follow-Up Research Questions
                    </h3>
                    <div className="flex flex-col gap-2">
                      {result.followUpResearchQuestions.map((fq, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuery(fq)}
                          className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-left text-xs text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/40"
                        >
                          <span className="text-indigo-500 font-bold">Q{idx + 1}:</span>
                          <span>{fq}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-400 shadow-xs">
                <span className="text-4xl">📚</span>
                <p className="mt-3 text-sm font-semibold text-slate-600">No Research Query Selected</p>
                <p className="mt-1 text-xs text-slate-400">Choose a quick preset on the left or type your own research inquiry to generate an analytical solution.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DEEP SEMANTIC BOOK SEARCH & SYNOPSIS */}
      {activeTab === 'semantic' && (
        <div className="flex flex-col gap-6">
          {/* Search Header Bar & Presets */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Natural Language Conceptual Book Search</h2>
            <p className="mt-1 text-xs text-slate-500">
              Search by describing a complex engineering problem, academic thesis topic, or computational theory without needing exact titles.
            </p>

            <form onSubmit={handleSemanticSearchSubmit} className="mt-4 flex gap-3">
              <input
                type="text"
                value={semanticQuery}
                onChange={(e) => setSemanticQuery(e.target.value)}
                placeholder="e.g. Books explaining distributed consensus, Paxos, and replication lag under network partitions..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={semanticLoading || !semanticQuery.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {semanticLoading ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Searching ({elapsedSecs}s)...</span>
                  </>
                ) : (
                  <>
                    <span>🔍 Semantic Search</span>
                  </>
                )}
              </button>
            </form>

            {/* Preset Concept Queries */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[11px] font-semibold text-slate-400 py-1">Try conceptual queries:</span>
              {PRESET_SEMANTIC_QUERIES.map((pq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSemanticSearchSubmit(null, pq)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50"
                >
                  {pq.length > 50 ? pq.substring(0, 48) + '...' : pq}
                </button>
              ))}
            </div>

            {semanticError && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                {semanticError}
              </div>
            )}
          </div>

          {/* Results Grid */}
          {semanticLoading ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
              <div className="size-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="mt-4 text-xs font-semibold text-slate-800">Analyzing Catalog Semantic Embeddings...</p>
              <p className="mt-1 text-[11px] text-slate-500">Gemini 3.5 is matching conceptual intent against course syllabi and textbook chapters ({elapsedSecs}s)</p>
            </div>
          ) : semanticResult ? (
            <div className="flex flex-col gap-6">
              {/* Conceptual Synthesis Card */}
              {semanticResult.conceptualSummary && (
                <div className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/60 to-purple-50/30 p-4 text-xs text-indigo-950">
                  <span className="font-bold text-indigo-700">Conceptual Focus Analysis: </span>
                  {semanticResult.conceptualSummary}
                </div>
              )}

              {/* Matched Books Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {semanticResult.results.map((book, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{book.title}</h3>
                          <p className="text-xs text-slate-500">by {book.author}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          book.matchScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {book.matchScore}% Match
                        </span>
                      </div>

                      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                        <span className="font-semibold text-slate-900">Why it matches: </span>
                        {book.relevanceExplanation}
                      </div>

                      {book.recommendedChapters && (
                        <div className="mt-2 text-[11px] text-indigo-700">
                          <span className="font-semibold">Recommended Sections: </span>
                          {book.recommendedChapters}
                        </div>
                      )}

                      {book.keyTopicsMatched && book.keyTopicsMatched.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {book.keyTopicsMatched.map((topic, tidx) => (
                            <span key={tidx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                              #{topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleFetchSynopsis(book)}
                        className="rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                      >
                        📖 View Academic Synopsis
                      </button>
                      <span className="text-[10px] text-slate-400">Archivalia Catalog</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended External Literature Additions */}
              {semanticResult.recommendedExternalAdditions && semanticResult.recommendedExternalAdditions.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Additional Seminal Literature in this Academic Domain
                  </h3>
                  <div className="flex flex-col gap-2">
                    {semanticResult.recommendedExternalAdditions.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs text-slate-700">
                        <span className="text-indigo-500 font-bold">★</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-400 shadow-xs">
              <span className="text-4xl">🔍</span>
              <p className="mt-3 text-sm font-semibold text-slate-600">No Semantic Search Executed</p>
              <p className="mt-1 text-xs text-slate-400">Click a concept query above or type what you are trying to understand to see ranked book matches.</p>
            </div>
          )}

          {/* Book Synopsis Modal / Card */}
          {synopsisLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-white p-8 text-center shadow-xl">
                <div className="size-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="mt-4 text-sm font-bold text-slate-900">Synthesizing Academic Synopsis...</p>
                <p className="mt-1 text-xs text-slate-500">Gemini 3.5 is analyzing syllabus alignment and chapter breakdowns ({elapsedSecs}s)</p>
              </div>
            </div>
          )}

          {selectedSynopsis && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {selectedSynopsis.cached ? '⚡ Cached in Local DB' : '✦ Generated Live by Gemini'}
                    </span>
                    <h2 className="mt-1 text-base font-bold text-slate-900">{selectedSynopsis.bookTitle}</h2>
                    <p className="text-xs text-slate-500">by {selectedSynopsis.author}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSynopsis(null)}
                    className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs">
                  {/* Overview */}
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Academic Overview</h4>
                    <p className="mt-1.5 leading-relaxed text-slate-700">{selectedSynopsis.overview}</p>
                  </div>

                  {/* Target Audience & Theory Ratio */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">Target Audience</span>
                      <p className="mt-0.5 font-medium text-slate-800">{selectedSynopsis.targetAudience}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">Theory vs Practice</span>
                      <p className="mt-0.5 font-medium text-slate-800">{selectedSynopsis.theoryVsPractical}</p>
                    </div>
                  </div>

                  {/* Core Principle */}
                  {selectedSynopsis.corePrinciple && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-amber-950">
                      <span className="font-bold">Core Foundational Takeaway: </span>
                      {selectedSynopsis.corePrinciple}
                    </div>
                  )}

                  {/* Prerequisites */}
                  {selectedSynopsis.prerequisites && selectedSynopsis.prerequisites.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recommended Prerequisites</h4>
                      <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-600">
                        {selectedSynopsis.prerequisites.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Themes / Chapters */}
                  {selectedSynopsis.keyThemes && selectedSynopsis.keyThemes.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Key Themes & Foundational Chapters</h4>
                      <div className="mt-1.5 space-y-2">
                        {selectedSynopsis.keyThemes.map((theme, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-700">
                            {theme}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-slate-100 px-6 py-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedSynopsis(null)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Close Synopsis
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
