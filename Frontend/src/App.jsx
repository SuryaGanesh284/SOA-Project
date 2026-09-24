import { useState } from 'react'
import AuthScreen from './components/AuthScreen.jsx'
import CategoryPage from './components/CategoryPage.jsx'
import Collections from './components/Collections.jsx'
import ForYou from './components/ForYou.jsx'
import NewArrivals from './components/NewArrivals.jsx'
import ResourceDetail from './components/ResourceDetail.jsx'
import SearchResults from './components/SearchResults.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Trending from './components/Trending.jsx'
import { bookByTitle, booksFor, searchCatalog, sectionLabels } from './data/catalog.js'
import { clearSession, loadSession, register, signIn } from './data/session.js'

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [sectionId, setSectionId] = useState('discover')
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [session, setSession] = useState(() => loadSession())
  const searching = query.trim().length > 0
  const selectedBook = bookByTitle(selectedTitle)

  function enter(result) {
    if (result.session) {
      setSession(result.session)
      setAuthMode(null)
      setQuery('')
      setSelectedTitle(null)
      setSectionId(result.session.role === 'ADMIN' ? 'dashboard' : 'discover')
    }
    return result
  }

  if (authMode) {
    return (
      <AuthScreen
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthMode(null)}
        onSignIn={(email, password) => enter(signIn(email, password))}
        onRegister={(name, email, password) => enter(register(name, email, password))}
      />
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas p-3 font-sans text-ink sm:p-5 md:p-6">
      <div className="flex h-[calc(100svh-1.5rem)] w-full overflow-hidden rounded-window bg-white shadow-window sm:h-[calc(100svh-2.5rem)] md:h-[calc(100svh-3rem)]">
        <Sidebar
          activeId={sectionId}
          user={session}
          onAccount={() => setAuthMode('login')}
          onSignOut={() => {
            clearSession()
            setSession(null)
            setSectionId('discover')
          }}
          onSelect={(id) => {
            setSectionId(id)
            setQuery('')
            setSelectedTitle(null)
          }}
        />
        <main aria-label="Library window" className="flex min-w-0 flex-1 flex-col bg-white">
          <TopBar
            query={query}
            onQueryChange={(value) => {
              setQuery(value)
              setSelectedTitle(null)
            }}
            view={view}
            onViewChange={setView}
          />
          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            {session?.role === 'ADMIN' ? (
              <section className="px-6" aria-label="Admin shell">
                <h2 className="text-lg font-semibold">
                  {sectionId === 'dashboard' ? 'Dashboard' : sectionId[0].toUpperCase() + sectionId.slice(1)}
                </h2>
                <p className="mt-1 text-sm text-muted">Signed in as {session.name}.</p>
              </section>
            ) : selectedBook ? (
              <ResourceDetail book={selectedBook} onBack={() => setSelectedTitle(null)} />
            ) : searching ? (
              <SearchResults query={query} results={searchCatalog(query)} view={view} onOpen={setSelectedTitle} />
            ) : sectionId !== 'discover' ? (
              <CategoryPage title={sectionLabels[sectionId]} books={booksFor(sectionId)} view={view} onOpen={setSelectedTitle} />
            ) : (
              <>
                <NewArrivals onOpen={setSelectedTitle} />
                <div className="mt-8 grid grid-cols-[minmax(0,1fr)_220px] gap-6 px-6">
                  <ForYou onOpen={setSelectedTitle} />
                  <Trending />
                </div>
                <Collections />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
