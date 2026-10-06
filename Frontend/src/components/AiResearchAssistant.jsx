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
  const [query, setQuery] = useState('')
  const [academicField, setAcademicField] = useState('Computer Science & AI')
  const [difficultyLevel, setDifficultyLevel] = useState('Postgraduate')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [healthStatus, setHealthStatus] = useState(null)
  const [elapsedSecs, setElapsedSecs] = useState(0)

  const userId = user?.id || user?.email || 'scholar'

  // Load initial health status and history
  useEffect(() => {
    checkHealth()
    loadHistory()
  }, [])

  // Timer while loading
  useEffect(() => {
    let timer
    if (loading) {
      setElapsedSecs(0)
      timer = setInterval(() => {
        setElapsedSecs((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [loading])

  const checkHealth = async () => {
    const res = await aiApi.getHealth()
    if (res.data) {
      setHealthStatus(res.data)
    }
  }

  const loadHistory = async () => {
    const res = await aiApi.getResearchHistory(userId)
    if (res.data && Array.isArray(res.data)) {
      setHistory(res.data)
    }
  }

  const handleSubmit = async (e) => {
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

  const handleSelectPreset = (preset) => {
    setQuery(preset.query)
    setAcademicField(preset.field)
    setDifficultyLevel(preset.level)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50/60 p-6">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-linear-to-r from-navy via-indigo-950 to-slate-900 p-6 text-white shadow-lg md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
              ✦
            </span>
            <h1 className="text-xl font-bold tracking-tight">Academic Research Assistant & Problem Solver</h1>
          </div>
          <p className="mt-2 text-xs text-slate-300 md:text-sm">
            Powered by live Google Gemini 3.5 AI. Provides rigorous mathematical derivations, algorithm proofs, textbook citations, and library catalog roadmaps.
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Form & Presets (5 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Preset Queries */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Academic Prompts</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
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

          {/* History Accordion / List */}
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

        {/* Right Column: Solution Presentation (7 cols) */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          {loading ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
              <div className="size-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="mt-4 text-sm font-semibold text-slate-800">Generating Academic Solution...</p>
              <p className="mt-1 text-xs text-slate-500">Gemini 3.5 Flash is executing step-by-step calculus derivations, proofs, and textbook cross-referencing ({elapsedSecs}s elapsed)</p>
            </div>
          ) : result ? (
            <div className="flex flex-col gap-5">
              {/* Executive Summary Card */}
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

              {/* Mathematical Formulations (LaTeX / Formulas) */}
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

              {/* Real-World Engineering Applications */}
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

              {/* Recommended Textbooks & Seminal Papers */}
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

              {/* Search Keywords (Cross-referenced with Archivalia Catalog) */}
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
                        title="Click to search catalog"
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
    </div>
  )
}
