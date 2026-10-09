import { useEffect, useState } from 'react'
import { discoveryApi } from '../services/api.js'

function AdminDiscovery({ onCatalogRefresh }) {
  const [activeTab, setActiveTab] = useState('search') // 'search', 'scraper', 'jobs'
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('ALL')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [importingTitle, setImportingTitle] = useState(null)
  const [importSuccess, setImportSuccess] = useState(null)

  // Pre-configured academic scrape URLs
  const PRESET_SCRAPE_SAMPLES = [
    {
      name: 'Wikipedia: Service-Oriented Architecture',
      url: 'https://en.wikipedia.org/wiki/Service-oriented_architecture',
    },
    {
      name: 'MIT Press: Introduction to Algorithms',
      url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
    },
    {
      name: 'OSTEP: Operating Systems Three Easy Pieces',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    },
    {
      name: 'Open Library: Designing Data-Intensive Applications',
      url: 'https://openlibrary.org/works/OL17855320W',
    },
  ]

  const DEFAULT_SCRAPED_SAMPLE = {
    title: 'Service-oriented architecture - Wikipedia',
    author: 'Online Academic Archive',
    year: 2024,
    description: 'Service-oriented architecture (SOA) is a software design style where services are provided to application components through communication protocols over a network.',
    isbn: null,
    category: 'papers',
    swatch: 'from-violet-500 to-purple-950',
    source: 'JSOUP_SCRAPER',
    tags: ['soa', 'microservices', 'architecture', 'web-reference'],
    previewUrl: 'https://en.wikipedia.org/wiki/Service-oriented_architecture',
  }

  // URL Scraper state - prefilled so metadata is immediately available
  const [scrapeUrl, setScrapeUrl] = useState('https://en.wikipedia.org/wiki/Service-oriented_architecture')
  const [scraping, setScraping] = useState(false)
  const [scrapedResult, setScrapedResult] = useState(DEFAULT_SCRAPED_SAMPLE)
  const [scrapeError, setScrapeError] = useState(null)
  const [isEditingMetadata, setIsEditingMetadata] = useState(false)

  // Jobs history state
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(false)

  const PRESET_QUERIES = [
    'Distributed Systems',
    'Artificial Intelligence',
    'Algorithms',
    'Site Reliability Engineering',
    'Database Systems',
    'Operating Systems',
  ]

  async function handleSearch(searchQuery = query) {
    try {
      setLoading(true)
      setImportSuccess(null)
      const res = await discoveryApi.search(searchQuery, source)
      if (res && res.data) {
        setResults(res.data)
      }
    } catch (e) {
      console.error('Search failed:', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleScrape(overrideUrl = null) {
    let target = (overrideUrl !== null ? overrideUrl : scrapeUrl) || ''
    target = target.trim()
    if (!target) {
      target = 'https://en.wikipedia.org/wiki/Service-oriented_architecture'
      setScrapeUrl(target)
    }

    // Auto-normalize URL scheme if missing
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`
      setScrapeUrl(target)
    }

    try {
      setScraping(true)
      setScrapeError(null)
      const res = await discoveryApi.scrapeUrl(target)
      if (res && res.data) {
        setScrapedResult(res.data)
      } else if (res && res.error) {
        setScrapeError(res.error || 'Failed to scrape target URL. Make sure the URL is accessible.')
      } else {
        setScrapeError('No metadata could be parsed from this page. Try one of the academic presets below.')
      }
    } catch (e) {
      setScrapeError(e.message || 'Network error while contacting Discovery scraper service.')
    } finally {
      setScraping(false)
    }
  }

  async function handleImport(book) {
    try {
      setImportingTitle(book.title)
      setImportSuccess(null)
      const payload = {
        title: book.title,
        author: book.author,
        year: book.year || 2024,
        category: book.category || 'ebooks',
        description: book.description,
        swatch: book.swatch || 'from-indigo-500 to-slate-900',
        copiesCount: 1,
        copyLocation: 'Digital Archive / Shelf D1',
        groups: [book.category || 'ebooks', 'saved', 'research'],
      }

      const res = await discoveryApi.importToCatalog(payload)
      if (res && res.data) {
        setImportSuccess(`"${book.title}" successfully ingested into Archivalia Catalog!`)
        if (onCatalogRefresh) onCatalogRefresh()
        loadJobs()
      }
    } catch (e) {
      console.error('Import failed:', e)
    } finally {
      setImportingTitle(null)
    }
  }

  async function loadJobs() {
    try {
      setJobsLoading(true)
      const res = await discoveryApi.getJobs()
      if (res && res.data) {
        setJobs(res.data)
      }
    } catch (e) {
      console.error('Failed to load jobs:', e)
    } finally {
      setJobsLoading(false)
    }
  }

  useEffect(() => {
    handleSearch('')
    loadJobs()
  }, [])

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-ink">Resource Discovery & Web Scraping</h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              Service :8087
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Search external academic libraries, scrape web publication metadata using JSoup, and import titles directly into the catalog.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-xl bg-field p-1">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'search' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            Catalog Search
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scraper')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'scraper' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            Web Scraper (JSoup)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('jobs')
              loadJobs()
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'jobs' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            Ingestion Jobs ({jobs.length})
          </button>
        </div>
      </div>

      {/* Global Success Notification */}
      {importSuccess && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{importSuccess}</span>
          </div>
          <button type="button" onClick={() => setImportSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: Academic Catalog Search */}
      {activeTab === 'search' && (
        <div className="mt-6 space-y-6">
          {/* Search Box & Controls */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by title, author, keyword, or ISBN across Open Library & Academic repositories..."
                  className="w-full rounded-xl border border-slate-200 bg-field px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-primary focus:bg-white focus:outline-hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      handleSearch('')
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    &times;
                  </button>
                )}
              </div>

              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-ink focus:border-primary focus:outline-hidden"
              >
                <option value="ALL">All External Sources</option>
                <option value="OPEN_LIBRARY">Open Library Search API</option>
                <option value="MIT_OPEN_COURSEWARE">MIT OpenCourseWare</option>
                <option value="ARXIV">ArXiv Academic Preprints</option>
              </select>

              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Repositories'}
              </button>
            </div>

            {/* Quick Preset Query Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-muted">Suggestions:</span>
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setQuery(preset)
                    handleSearch(preset)
                  }}
                  className="rounded-lg bg-field px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">
                Discovered Academic Publications ({results.length})
              </h2>
              {loading && <span className="text-xs text-muted">Querying external endpoints...</span>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((book) => {
                const isImporting = importingTitle === book.title
                return (
                  <div
                    key={book.title}
                    className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <div>
                      {/* Top Bar: Cover swatch + Badges */}
                      <div className="flex gap-3">
                        <div
                          className={`aspect-[3/4] w-16 shrink-0 rounded-lg bg-gradient-to-br ${book.swatch || 'from-indigo-500 to-slate-900'} shadow-xs`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                              {book.category}
                            </span>
                            <span className="inline-block rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                              {book.source}
                            </span>
                          </div>
                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ink" title={book.title}>
                            {book.title}
                          </h3>
                          <p className="truncate text-xs text-muted">{book.author}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">Published: {book.year || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-3 line-clamp-3 text-xs text-slate-600">
                        {book.description}
                      </p>

                      {/* Tags */}
                      {book.tags && book.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {book.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-md bg-field px-1.5 py-0.5 text-[10px] text-muted">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => handleImport(book)}
                        disabled={isImporting}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50"
                      >
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{isImporting ? 'Ingesting to Catalog...' : 'Import to Catalog'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Web Scraper (JSoup) */}
      {activeTab === 'scraper' && (
        <div className="mt-6 max-w-4xl space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-ink">Live HTML Web Scraper (JSoup)</h2>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                    Endpoint: /api/v1/discovery/scrape-url
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Extract OpenGraph metadata, title, author, year, and abstract descriptions from any web resource or paper.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScrapeUrl(DEFAULT_SCRAPED_SAMPLE.previewUrl)
                  setScrapedResult({ ...DEFAULT_SCRAPED_SAMPLE })
                  setScrapeError(null)
                  setIsEditingMetadata(false)
                }}
                className="text-xs font-medium text-primary hover:underline shrink-0"
              >
                Reset to Default Sample
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                placeholder="Enter web page URL (e.g. https://en.wikipedia.org/wiki/Service-oriented_architecture)"
                className="w-full flex-1 rounded-xl border border-slate-200 bg-field px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-primary focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleScrape()}
                disabled={scraping}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <svg className={`size-4 ${scraping ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{scraping ? 'Scraping Metadata...' : 'Scrape MetaData'}</span>
              </button>
            </div>

            {/* Quick Academic Scrape Presets */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-muted">Academic Presets:</span>
              {PRESET_SCRAPE_SAMPLES.map((sample) => (
                <button
                  key={sample.url}
                  type="button"
                  onClick={() => {
                    setScrapeUrl(sample.url)
                    handleScrape(sample.url)
                  }}
                  className="rounded-lg bg-field px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-ink"
                >
                  {sample.name}
                </button>
              ))}
            </div>

            {scrapeError && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-rose-50 p-3.5 text-xs text-rose-700">
                <div className="flex items-center gap-2">
                  <svg className="size-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{scrapeError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fallbackUrl = 'https://en.wikipedia.org/wiki/Service-oriented_architecture'
                    setScrapeUrl(fallbackUrl)
                    handleScrape(fallbackUrl)
                  }}
                  className="ml-3 font-semibold text-rose-900 underline hover:text-rose-950 shrink-0"
                >
                  Try Wikipedia SOA
                </button>
              </div>
            )}
          </div>

          {/* Scraped Result / Metadata Available Card */}
          {scrapedResult && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Scraped MetaData Available
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-600">
                    Source: {scrapedResult.source || 'JSOUP_SCRAPER'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingMetadata(!isEditingMetadata)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {isEditingMetadata ? 'Done Editing' : 'Customize Metadata'}
                  </button>
                  {scrapedResult.previewUrl && (
                    <a
                      href={scrapedResult.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted hover:text-ink truncate max-w-xs underline"
                      title={scrapedResult.previewUrl}
                    >
                      Visit Target URL &rarr;
                    </a>
                  )}
                </div>
              </div>

              {/* View / Edit Mode */}
              {!isEditingMetadata ? (
                <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                  <div
                    className={`aspect-[3/4] w-24 shrink-0 rounded-xl bg-gradient-to-br ${
                      scrapedResult.swatch || 'from-indigo-500 to-slate-900'
                    } shadow-md flex items-end p-2.5 text-white`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {scrapedResult.category}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                        {scrapedResult.category}
                      </span>
                      <span className="text-xs text-slate-400">Year: {scrapedResult.year || 2024}</span>
                    </div>

                    <h3 className="mt-2 text-lg font-bold text-ink leading-snug">
                      {scrapedResult.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-600">
                      Author / Creator: <span className="text-ink">{scrapedResult.author}</span>
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {scrapedResult.description}
                    </p>

                    {scrapedResult.tags && scrapedResult.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {scrapedResult.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Book / Article Title
                      </label>
                      <input
                        type="text"
                        value={scrapedResult.title}
                        onChange={(e) => setScrapedResult({ ...scrapedResult, title: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Author / Origin
                      </label>
                      <input
                        type="text"
                        value={scrapedResult.author}
                        onChange={(e) => setScrapedResult({ ...scrapedResult, author: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Publication Year
                      </label>
                      <input
                        type="number"
                        value={scrapedResult.year || 2024}
                        onChange={(e) => setScrapedResult({ ...scrapedResult, year: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Catalog Category
                      </label>
                      <select
                        value={scrapedResult.category}
                        onChange={(e) => setScrapedResult({ ...scrapedResult, category: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-hidden"
                      >
                        <option value="papers">Academic Papers & References</option>
                        <option value="ebooks">E-Books & Digital Editions</option>
                        <option value="physical">Physical Reserve Copies</option>
                        <option value="videos">Course Video & Audio</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Scraped Abstract / Description
                    </label>
                    <textarea
                      rows={3}
                      value={scrapedResult.description}
                      onChange={(e) => setScrapedResult({ ...scrapedResult, description: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-ink focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Action: Import to Catalog */}
              <div className="mt-6 border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-muted">
                  Ready to ingest into <span className="font-semibold text-ink">Book Service (:8082)</span> with 1 accession copy.
                </div>

                <button
                  type="button"
                  onClick={() => handleImport(scrapedResult)}
                  disabled={importingTitle === scrapedResult.title}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {importingTitle === scrapedResult.title ? 'Ingesting into Catalog...' : 'Confirm One-Click Ingestion to Catalog'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Ingestion Jobs History */}
      {activeTab === 'jobs' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Catalog Ingestion Audit Trail</h2>
            <button
              type="button"
              onClick={loadJobs}
              disabled={jobsLoading}
              className="text-xs text-primary hover:underline"
            >
              {jobsLoading ? 'Refreshing...' : 'Refresh History'}
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Job Code</th>
                  <th className="px-4 py-3">Target Title</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-medium text-slate-800">{job.jobCode}</td>
                    <td className="px-4 py-3 font-medium text-ink">{job.targetTitle}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                        {job.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          job.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted max-w-xs truncate" title={job.details}>
                      {job.details}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {job.importedAt ? new Date(job.importedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDiscovery
