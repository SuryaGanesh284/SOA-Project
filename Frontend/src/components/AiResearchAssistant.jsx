import React, { useState, useEffect } from 'react'
import { aiApi, requirementsApi } from '../services/api'

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

const PRESET_STUDY_PACKS = [
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    topic: 'Distributed Transactions, Raft Consensus & Replication Lag',
    level: 'Postgraduate',
  },
  {
    title: 'Operating Systems: Three Easy Pieces',
    author: 'Remzi Arpaci-Dusseau & Andrea Arpaci-Dusseau',
    isbn: '978-1985086593',
    topic: 'Virtual Memory Paging, TLB Invalidation & Semaphores',
    level: 'Undergraduate',
  },
  {
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    isbn: '978-0262033848',
    topic: 'Dynamic Programming, Bellman-Ford & NP-Completeness',
    level: 'Postgraduate',
  },
  {
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James Kurose & Keith Ross',
    isbn: '978-0133594140',
    topic: 'TCP Congestion Control, BGP Autonomous Routing & TLS Handshakes',
    level: 'Undergraduate',
  },
  {
    title: 'Structure and Interpretation of Computer Programs (SICP)',
    author: 'Harold Abelson & Gerald Jay Sussman',
    isbn: '978-0262510875',
    topic: 'Metalinguistic Abstraction, Environments & Lazy Evaluation',
    level: 'PhD / Research',
  },
]

export default function AiResearchAssistant({ user, onSearchKeyword, initialBook }) {
  const [activeTab, setActiveTab] = useState('solve') // 'solve' | 'semantic' | 'studypack'

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

  // Feature 3 State (Study Packs & Interactive Quiz)
  const [studyTitle, setStudyTitle] = useState('Designing Data-Intensive Applications')
  const [studyAuthor, setStudyAuthor] = useState('Martin Kleppmann')
  const [studyIsbn, setStudyIsbn] = useState('978-1449373320')
  const [studyTopic, setStudyTopic] = useState('Distributed Transactions, Raft Consensus & Replication Lag')
  const [studyLevel, setStudyLevel] = useState('Postgraduate')
  const [studyLoading, setStudyLoading] = useState(false)
  const [studyPack, setStudyPack] = useState(null)
  const [studyError, setStudyError] = useState(null)
  const [userAnswers, setUserAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [recentStudyPacks, setRecentStudyPacks] = useState([])

  // Feature 4 State (Predictive Demand & Restock Forecaster)
  const [demandReport, setDemandReport] = useState(null)
  const [demandLoading, setDemandLoading] = useState(false)
  const [demandError, setDemandError] = useState(null)
  const [requisitionStatus, setRequisitionStatus] = useState({})

  // Shared State
  const [healthStatus, setHealthStatus] = useState(null)

  const userId = user?.id || user?.email || 'scholar'

  useEffect(() => {
    checkHealth()
    loadHistory()
    loadRecentStudyPacks()
  }, [])

  useEffect(() => {
    if (initialBook && initialBook.title) {
      setActiveTab('studypack')
      setStudyTitle(initialBook.title)
      setStudyAuthor(initialBook.author || '')
      setStudyIsbn(initialBook.isbn || '')
      setStudyTopic('')
      handleGenerateStudyPack(null, {
        title: initialBook.title,
        author: initialBook.author || '',
        isbn: initialBook.isbn || '',
        topic: '',
        level: studyLevel,
      })
    }
  }, [initialBook])

  useEffect(() => {
    let timer
    if (loading || semanticLoading || synopsisLoading || studyLoading || evaluating) {
      setElapsedSecs(0)
      timer = setInterval(() => {
        setElapsedSecs((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [loading, semanticLoading, synopsisLoading, studyLoading, evaluating])

  const checkHealth = async () => {
    const res = await aiApi.getHealth()
    if (res.data) setHealthStatus(res.data)
  }

  const loadHistory = async () => {
    const res = await aiApi.getResearchHistory(userId)
    if (res.data && Array.isArray(res.data)) setHistory(res.data)
  }

  const loadRecentStudyPacks = async () => {
    try {
      const res = await aiApi.getRecentStudyPacks()
      if (res.data && Array.isArray(res.data)) setRecentStudyPacks(res.data)
    } catch (e) {
      console.warn('Failed to load recent study packs', e)
    }
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

  // Feature 3: Dynamic Study Pack Handlers
  const handleGenerateStudyPack = async (e, overrideParams, forceRefresh = false) => {
    if (e) e.preventDefault()
    const titleToUse = overrideParams?.title || studyTitle
    const authorToUse = overrideParams?.author || studyAuthor
    const isbnToUse = overrideParams?.isbn || studyIsbn
    const topicToUse = overrideParams?.topic !== undefined ? overrideParams.topic : studyTopic
    const levelToUse = overrideParams?.level || studyLevel

    if (!titleToUse.trim()) return

    if (overrideParams) {
      if (overrideParams.title) setStudyTitle(overrideParams.title)
      if (overrideParams.author !== undefined) setStudyAuthor(overrideParams.author)
      if (overrideParams.isbn !== undefined) setStudyIsbn(overrideParams.isbn)
      if (overrideParams.topic !== undefined) setStudyTopic(overrideParams.topic)
      if (overrideParams.level) setStudyLevel(overrideParams.level)
    }

    setStudyLoading(true)
    setStudyError(null)
    setUserAnswers({})
    setQuizSubmitted(false)
    setEvaluationResult(null)

    try {
      const res = await aiApi.getStudyPack({
        bookTitle: titleToUse.trim(),
        author: authorToUse ? authorToUse.trim() : '',
        isbn: isbnToUse ? isbnToUse.trim() : '',
        topicOrExamFocus: topicToUse ? topicToUse.trim() : '',
        difficultyLevel: levelToUse,
        forceRefresh,
      })

      if (res.error) {
        setStudyError(res.error)
      } else if (res.data) {
        setStudyPack(res.data)
        loadRecentStudyPacks()
      }
    } catch (err) {
      setStudyError(err.message || 'Failed to synthesize study pack')
    } finally {
      setStudyLoading(false)
    }
  }

  const handleSelectAnswer = (questionNumber, optionIndex) => {
    if (quizSubmitted) return
    setUserAnswers((prev) => ({
      ...prev,
      [questionNumber]: optionIndex,
    }))
  }

  const handleSubmitQuiz = async () => {
    if (!studyPack?.id) return
    setEvaluating(true)
    try {
      const res = await aiApi.evaluateStudyPackQuiz({
        studyPackId: studyPack.id,
        answers: userAnswers,
      })
      if (res.data) {
        setEvaluationResult(res.data)
        setQuizSubmitted(true)
      }
    } catch (err) {
      console.error('Quiz evaluation failed', err)
    } finally {
      setEvaluating(false)
    }
  }

  const handleResetQuiz = () => {
    setUserAnswers({})
    setQuizSubmitted(false)
    setEvaluationResult(null)
  }

  const handleOpenStudyPackForBook = (title, author, isbn) => {
    setActiveTab('studypack')
    setStudyTitle(title || '')
    setStudyAuthor(author || '')
    setStudyIsbn(isbn || '')
    setStudyTopic('')
    handleGenerateStudyPack(null, { title, author, isbn, topic: '', level: studyLevel })
  }

  // Feature 4: Predictive Demand Forecaster Handlers
  const handleFetchDemandReport = async (forceRefresh = false) => {
    setDemandLoading(true)
    setDemandError(null)
    try {
      const res = await aiApi.getPredictiveDemandReport(forceRefresh)
      if (res.error) {
        setDemandError(res.error)
      } else if (res.data) {
        setDemandReport(res.data)
      }
    } catch (err) {
      setDemandError(err.message || 'Failed to generate predictive demand forecast')
    } finally {
      setDemandLoading(false)
    }
  }

  const handleOrderRequisition = async (item, idx) => {
    try {
      setRequisitionStatus((prev) => ({ ...prev, [idx]: 'loading' }))
      const note = `AI Requisition: +${item.recommendedRequisitionCopies} copies (${item.academicRationale})`
      await requirementsApi.addRequirement({
        title: `${item.bookTitle} (+${item.recommendedRequisitionCopies} Copies)`,
        note,
      })
      setRequisitionStatus((prev) => ({ ...prev, [idx]: 'done' }))
    } catch (e) {
      console.error('Failed to create requisition', e)
      setRequisitionStatus((prev) => ({ ...prev, [idx]: 'error' }))
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

        <button
          type="button"
          onClick={() => setActiveTab('studypack')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition ${
            activeTab === 'studypack'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>📚 Study Packs & Interactive Quizzes</span>
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] text-purple-700 font-medium">Feature 3</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('demand')
            if (!demandReport && !demandLoading) {
              handleFetchDemandReport(false)
            }
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition ${
            activeTab === 'demand'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>📈 Circulation Demand & Restock Forecaster</span>
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-700 font-medium">Feature 4</span>
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
                <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenStudyPackForBook(selectedSynopsis.title, selectedSynopsis.author, selectedSynopsis.isbn)
                      setSelectedSynopsis(null)
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
                  >
                    <span>📚 Generate Study Pack & Quiz</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSynopsis(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Close Synopsis
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DYNAMIC STUDY PACKS & INTERACTIVE REVISION QUIZZES */}
      {activeTab === 'studypack' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Textbook Presets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Popular Academic Textbooks</h3>
              <div className="flex flex-col gap-2">
                {PRESET_STUDY_PACKS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setStudyTitle(preset.title)
                      setStudyAuthor(preset.author)
                      setStudyIsbn(preset.isbn)
                      setStudyTopic(preset.topic)
                      setStudyLevel(preset.level)
                    }}
                    className="group rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:border-purple-300 hover:bg-purple-50/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-purple-900">{preset.title}</p>
                      <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200">
                        {preset.level}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">By {preset.author}</p>
                    <p className="mt-1 text-[11px] text-purple-700 font-medium">Focus: {preset.topic}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Study Pack Generator Form */}
            <form onSubmit={(e) => handleGenerateStudyPack(e, null, false)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Study Pack Parameters</h3>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Book Title *</label>
                  <input
                    type="text"
                    value={studyTitle}
                    onChange={(e) => setStudyTitle(e.target.value)}
                    placeholder="e.g. Designing Data-Intensive Applications"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Author(s)</label>
                    <input
                      type="text"
                      value={studyAuthor}
                      onChange={(e) => setStudyAuthor(e.target.value)}
                      placeholder="e.g. Martin Kleppmann"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">ISBN (Optional)</label>
                    <input
                      type="text"
                      value={studyIsbn}
                      onChange={(e) => setStudyIsbn(e.target.value)}
                      placeholder="e.g. 978-1449373320"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Recitation / Exam Focus Topic</label>
                  <input
                    type="text"
                    value={studyTopic}
                    onChange={(e) => setStudyTopic(e.target.value)}
                    placeholder="e.g. Distributed Consensus, Raft vs Paxos, Replication Lag"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Target Academic Rigor</label>
                  <select
                    value={studyLevel}
                    onChange={(e) => setStudyLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  >
                    {DIFFICULTY_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={studyLoading || !studyTitle.trim()}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {studyLoading ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Synthesizing Study Pack ({elapsedSecs}s)...</span>
                    </>
                  ) : (
                    <>
                      <span>✦ Synthesize Dynamic Study Pack & Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Recently Generated Study Packs */}
            {recentStudyPacks.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Recently Generated Study Packs</h3>
                <div className="space-y-2">
                  {recentStudyPacks.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => {
                        setStudyPack(pack)
                        setStudyTitle(pack.bookTitle)
                        setStudyAuthor(pack.author || '')
                        setStudyIsbn(pack.isbn || '')
                        setStudyTopic(pack.topicOrExamFocus || '')
                        setUserAnswers({})
                        setQuizSubmitted(false)
                        setEvaluationResult(null)
                      }}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-left transition hover:border-purple-200 hover:bg-purple-50/30"
                    >
                      <p className="text-xs font-bold text-slate-800">{pack.bookTitle}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{pack.author || 'Academic'}</span>
                        <span className="rounded-sm bg-purple-50 px-1 text-purple-700">{pack.difficultyLevel || 'Intermediate'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (7 cols) - Study Pack Results */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {studyLoading && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-linear-to-b from-purple-50/50 to-white p-12 text-center shadow-xs">
                <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md animate-pulse">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-base font-bold text-slate-800">Synthesizing Comprehensive Study Pack</h3>
                <p className="mt-1 max-w-md text-xs text-slate-500">
                  Google Gemini 3.5 Flash is extracting executive abstracts, formulating mathematical laws, and authoring 5 challenging examination scenario questions...
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-full bg-purple-100/80 px-3.5 py-1 text-xs font-medium text-purple-800">
                  <span className="size-2 animate-ping rounded-full bg-purple-600" />
                  <span>Elapsed: {elapsedSecs}s</span>
                </div>
              </div>
            )}

            {studyError && !studyLoading && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                  <span>⚠️ Study Pack Synthesis Error</span>
                </div>
                <p className="mt-2 text-xs text-rose-700">{studyError}</p>
                <button
                  type="button"
                  onClick={(e) => handleGenerateStudyPack(e, null, true)}
                  className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition"
                >
                  Retry with Force Refresh
                </button>
              </div>
            )}

            {!studyPack && !studyLoading && !studyError && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-600">
                  📚
                </div>
                <h3 className="text-base font-bold text-slate-800">Dynamic Academic Study Pack Engine</h3>
                <p className="mt-1 max-w-md text-xs text-slate-500">
                  Select a textbook preset from the left panel or enter any book title to dynamically synthesize high-yield formulas, core principles, and an interactive 5-question exam revision quiz.
                </p>
              </div>
            )}

            {studyPack && !studyLoading && (
              <div className="space-y-6">
                {/* Header Metadata Card */}
                <div className="rounded-2xl border border-purple-100 bg-linear-to-r from-purple-50/70 via-indigo-50/40 to-white p-5 shadow-xs">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                          Study Pack
                        </span>
                        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {studyPack.difficultyLevel || 'Postgraduate'}
                        </span>
                        {studyPack.cached ? (
                          <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            <span>⚡ Served from Local AI Cache</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                            <span>✨ Freshly Synthesized via {studyPack.modelUsed || 'gemini-3.5-flash'}</span>
                          </span>
                        )}
                      </div>

                      <h2 className="mt-2.5 text-lg font-bold text-slate-900">{studyPack.bookTitle}</h2>
                      {studyPack.author && <p className="text-xs text-slate-600 font-medium">By {studyPack.author}</p>}
                      {studyPack.topicOrExamFocus && (
                        <p className="mt-1 text-xs text-purple-800 font-medium">
                          Exam Focus: <span className="text-slate-800 font-normal">{studyPack.topicOrExamFocus}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleGenerateStudyPack(e, null, true)}
                      className="shrink-0 flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition shadow-xs"
                    >
                      <span>🔄 Force Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Executive Academic Abstract */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
                      §1
                    </span>
                    <h3 className="text-sm font-bold text-slate-800">Executive Academic Abstract</h3>
                  </div>
                  <div className="prose prose-sm text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                    {studyPack.executiveSummary}
                  </div>
                </div>

                {/* Section 2: High-Yield Principles */}
                {studyPack.highYieldPrinciples && studyPack.highYieldPrinciples.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 font-bold text-xs">
                        §2
                      </span>
                      <h3 className="text-sm font-bold text-slate-800">High-Yield Theoretical Principles</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {studyPack.highYieldPrinciples.map((principle, idx) => (
                        <div key={idx} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-800">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 3: Formulae, Algorithms & Mathematical Bounds */}
                {studyPack.formulaeOrAlgorithms && studyPack.formulaeOrAlgorithms.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs">
                        §3
                      </span>
                      <h3 className="text-sm font-bold text-slate-800">Formulae, Algorithms & Complexity Bounds</h3>
                    </div>
                    <div className="space-y-2.5">
                      {studyPack.formulaeOrAlgorithms.map((formula, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-emerald-300 shadow-inner">
                          <span className="text-slate-400 select-none mr-2 font-sans font-bold">[{idx + 1}]</span>
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Prerequisites & Industry Applications */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Prerequisites */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-amber-500 font-bold text-sm">✦</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Foundation Prerequisites</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {studyPack.prerequisites?.map((pre, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{pre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Industry Applications */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-indigo-500 font-bold text-sm">⚡</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Real-World Industry Applications</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {studyPack.realWorldApplications?.map((app, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 5: Interactive 5-Question Revision Quiz */}
                {studyPack.quizQuestions && studyPack.quizQuestions.length > 0 && (
                  <div className="rounded-2xl border-2 border-purple-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
                            §5
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">Interactive Revision & Exam Quiz</h3>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Solve these 5 conceptual scenarios. Choose an option for each question and submit for instant grading and detailed pedagogical explanations.
                        </p>
                      </div>

                      {quizSubmitted && (
                        <button
                          type="button"
                          onClick={handleResetQuiz}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          🔄 Retake Quiz
                        </button>
                      )}
                    </div>

                    {/* Quiz Evaluation Banner */}
                    {quizSubmitted && evaluationResult && (
                      <div className="mb-6 rounded-2xl border border-purple-200 bg-linear-to-r from-purple-50 via-indigo-50/50 to-white p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Academic Evaluation Result</span>
                            <h4 className="text-lg font-bold text-slate-900">{evaluationResult.performanceTier}</h4>
                            <p className="mt-1 text-xs text-slate-600 max-w-xl leading-relaxed">{evaluationResult.feedback}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-xs ring-1 ring-purple-100 min-w-32">
                            <span className="text-2xl font-black text-purple-700">
                              {evaluationResult.correctCount} / {evaluationResult.totalQuestions}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {evaluationResult.scorePercentage}% Score
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5 Questions */}
                    <div className="space-y-6">
                      {studyPack.quizQuestions.map((q) => {
                        const userChoice = userAnswers[q.questionNumber]
                        const isAnswered = userChoice !== undefined
                        const evalDetail = evaluationResult?.details?.find((d) => d.questionNumber === q.questionNumber)

                        return (
                          <div key={q.questionNumber} className="rounded-xl border border-slate-200 bg-slate-50/40 p-5">
                            {/* Question Header */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-slate-500">
                                Question {q.questionNumber} of {studyPack.quizQuestions.length}
                              </span>
                              {q.conceptTested && (
                                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-200/50">
                                  Concept: {q.conceptTested}
                                </span>
                              )}
                            </div>

                            {/* Question Text */}
                            <p className="text-xs font-semibold text-slate-800 leading-relaxed mb-4">
                              {q.question}
                            </p>

                            {/* 4 Options */}
                            <div className="grid grid-cols-1 gap-2.5">
                              {q.options?.map((opt, optIdx) => {
                                const optionLetter = String.fromCharCode(65 + optIdx)
                                const isSelected = userChoice === optIdx
                                const isCorrectAnswer = q.correctAnswerIndex === optIdx

                                let optionStyles = 'border-slate-200 bg-white text-slate-800 hover:border-purple-300 hover:bg-purple-50/30'

                                if (!quizSubmitted) {
                                  if (isSelected) {
                                    optionStyles = 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-500/20 font-medium'
                                  }
                                } else {
                                  if (isCorrectAnswer) {
                                    optionStyles = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/30'
                                  } else if (isSelected && !isCorrectAnswer) {
                                    optionStyles = 'border-rose-400 bg-rose-50 text-rose-950 font-medium ring-2 ring-rose-400/30 line-through decoration-rose-400'
                                  } else {
                                    optionStyles = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-70'
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    disabled={quizSubmitted}
                                    onClick={() => handleSelectAnswer(q.questionNumber, optIdx)}
                                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-xs transition ${optionStyles}`}
                                  >
                                    <span className={`flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                                      isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {optionLetter}
                                    </span>
                                    <span className="flex-1 leading-snug">{opt}</span>
                                    {quizSubmitted && isCorrectAnswer && (
                                      <span className="shrink-0 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        ✓ Correct
                                      </span>
                                    )}
                                    {quizSubmitted && isSelected && !isCorrectAnswer && (
                                      <span className="shrink-0 rounded-md bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        ✗ Selected
                                      </span>
                                    )}
                                  </button>
                                )
                              })}
                            </div>

                            {/* Technical Explanation (Shown when submitted) */}
                            {quizSubmitted && q.explanation && (
                              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-xs text-indigo-950">
                                <span className="font-bold text-indigo-900 block mb-1">💡 Pedagogical Rationale:</span>
                                <p className="leading-relaxed text-[11px] text-slate-700">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Quiz Submit Bar */}
                    {!quizSubmitted && (
                      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div className="text-xs text-slate-500">
                          <span className="font-bold text-slate-800">{Object.keys(userAnswers).length}</span> of {studyPack.quizQuestions.length} questions answered
                        </div>
                        <button
                          type="button"
                          disabled={evaluating || Object.keys(userAnswers).length === 0}
                          onClick={handleSubmitQuiz}
                          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition disabled:opacity-50"
                        >
                          {evaluating ? (
                            <>
                              <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Evaluating Responses...</span>
                            </>
                          ) : (
                            <span>Submit Quiz for Academic Evaluation</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CIRCULATION DEMAND & RESTOCK FORECASTER */}
      {activeTab === 'demand' && (
        <div className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-rose-600 text-white font-bold text-sm shadow-xs">
                    ✦
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">AI Predictive Restock & Circulation Forecaster</h2>
                  {demandReport?.overallCirculationHealth && (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      demandReport.overallCirculationHealth.toLowerCase().includes('severe') || demandReport.overallCirculationHealth.toLowerCase().includes('critical') || demandReport.overallCirculationHealth.toLowerCase().includes('bottleneck')
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {demandReport.overallCirculationHealth}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-slate-500 max-w-3xl leading-relaxed">
                  Empirical econometric queuing modeling (Poisson arrival distributions & Erlang-C blocking probabilities) analyzing catalog scarcity, active student loan velocities, and impending midterm exam surges.
                </p>
              </div>

              <button
                type="button"
                disabled={demandLoading}
                onClick={() => handleFetchDemandReport(true)}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:from-rose-700 hover:to-indigo-700 transition disabled:opacity-50 self-start sm:self-auto"
              >
                {demandLoading ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing Circulation Velocity...</span>
                  </>
                ) : (
                  <>
                    <span>🔄 Refresh AI Forecast</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {demandError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                <span className="font-bold">⚠️ Forecast Error: </span> {demandError}
              </div>
            )}

            {/* KPI Summary Cards */}
            {demandReport && (
              <>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Critical Stockouts</span>
                    <p className="mt-1 text-2xl font-black text-rose-800">{demandReport.criticalShortageCount}</p>
                    <p className="mt-0.5 text-[11px] text-rose-600">0 copies on shelf</p>
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">High Surge Risk</span>
                    <p className="mt-1 text-2xl font-black text-amber-800">{demandReport.highRiskCount}</p>
                    <p className="mt-0.5 text-[11px] text-amber-600">Imminent queue congestion</p>
                  </div>

                  <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Recommended Copies</span>
                    <p className="mt-1 text-2xl font-black text-purple-800">+{demandReport.totalRecommendedCopies}</p>
                    <p className="mt-0.5 text-[11px] text-purple-600">Requisitions needed</p>
                  </div>

                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Est. Requisition Budget</span>
                    <p className="mt-1 text-2xl font-black text-indigo-800">₹{demandReport.totalEstimatedBudgetInr}</p>
                    <p className="mt-0.5 text-[11px] text-indigo-600">Procurement allocation</p>
                  </div>
                </div>

                {/* Director Synthesis Box */}
                {demandReport.executiveSummary && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>📋</span> Library Director Econometric Synthesis
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Generated: {demandReport.generatedAt} {demandReport.cached ? '(Cached)' : '(Live)'}
                      </span>
                    </div>
                    <p className="leading-relaxed">{demandReport.executiveSummary}</p>
                  </div>
                )}

                {/* Itemized Predictions Table */}
                {demandReport.items && demandReport.items.length > 0 && (
                  <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Catalog Textbook</th>
                          <th className="py-3 px-4">Available / Total</th>
                          <th className="py-3 px-4">Active Loans</th>
                          <th className="py-3 px-4">Surge Probability</th>
                          <th className="py-3 px-4">Risk Tier</th>
                          <th className="py-3 px-4">Requisition</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {demandReport.items.map((item, idx) => {
                          const status = requisitionStatus[idx]
                          const isCritical = item.stockoutRisk === 'CRITICAL'
                          const isHigh = item.stockoutRisk === 'HIGH'

                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 transition">
                              <td className="py-3 px-4">
                                <p className="font-bold text-slate-800">{item.bookTitle}</p>
                                <span className="text-[10px] text-slate-400">{item.category} · {item.isbn || 'No ISBN'}</span>
                                <p className="mt-1 text-[11px] text-slate-600 max-w-sm italic">
                                  "{item.academicRationale}"
                                </p>
                              </td>
                              <td className="py-3 px-4 font-semibold">
                                <span className={item.currentAvailableCopies === 0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                                  {item.currentAvailableCopies}
                                </span>
                                <span className="text-slate-400"> / {item.currentTotalCopies}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-700 font-medium">
                                {item.activeBorrowsCount} active
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        item.predictedDemandSurgePercent >= 80 ? 'bg-rose-500' :
                                        item.predictedDemandSurgePercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${item.predictedDemandSurgePercent}%` }}
                                    />
                                  </div>
                                  <span className="font-bold text-slate-700">{item.predictedDemandSurgePercent}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  isHigh ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {item.stockoutRisk}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-purple-700">+{item.recommendedRequisitionCopies} copies</span>
                                <p className="text-[10px] text-slate-400">₹{item.estimatedBudgetInr}</p>
                              </td>
                              <td className="py-3 px-4 text-right">
                                {status === 'done' ? (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                    ✓ Requisitioned
                                  </span>
                                ) : status === 'error' ? (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700">
                                    Error
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={status === 'loading' || item.recommendedRequisitionCopies === 0}
                                    onClick={() => handleOrderRequisition(item, idx)}
                                    className="rounded-lg bg-navy px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-navy-light transition disabled:opacity-40"
                                  >
                                    {status === 'loading' ? 'Creating...' : '+ Order Requisition'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

