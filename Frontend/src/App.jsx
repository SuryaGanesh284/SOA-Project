import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard.jsx'
import AdminUsers from './components/AdminUsers.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import CategoryPage from './components/CategoryPage.jsx'
import Collections from './components/Collections.jsx'
import FinesPage from './components/FinesPage.jsx'
import ForYou from './components/ForYou.jsx'
import LoansPage from './components/LoansPage.jsx'
import NewArrivals from './components/NewArrivals.jsx'
import NotificationDrawer from './components/NotificationDrawer.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import ResourceDetail from './components/ResourceDetail.jsx'
import SearchResults from './components/SearchResults.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Trending from './components/Trending.jsx'
import { bookByTitle, booksFor, searchCatalog, sectionLabels } from './data/catalog.js'
import { loadFines, payFine } from './data/fines.js'
import { borrowTitle, loadLoans, returnLoan } from './data/loans.js'
import { clearSession, loadSession, register, saveSession, signIn } from './data/session.js'

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [sectionId, setSectionId] = useState('discover')
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [session, setSession] = useState(() => loadSession())
  const [loans, setLoans] = useState(() => loadLoans())
  const [fines, setFines] = useState(() => loadFines())
  const [notesOpen, setNotesOpen] = useState(false)
  const [notes, setNotes] = useState([
    { id: 'n1', title: 'Due soon', message: 'The Design of Everyday Things is due in 4 days.', read: false },
    { id: 'n2', title: 'Return recorded', message: 'Clean Code was returned.', read: false },
    { id: 'n3', title: 'Payment', message: 'A fine payment is ready to confirm.', read: true },
  ])
  const [profile, setProfile] = useState(() => {
    const current = loadSession()
    return {
      name: current?.name || 'Ben Bradle',
      userId: current?.role === 'ADMIN' ? 'ADM-001' : 'USR-101',
      email: current?.email || 'user@archivalia.test',
      phone: '9876543210',
    }
  })
  const activeLoan = loans.find((loan) => !loan.returnedAt)
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
          activeLoan={activeLoan}
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
        <main aria-label="Library window" className="relative flex min-w-0 flex-1 flex-col bg-white">
          <TopBar
            query={query}
            onQueryChange={(value) => {
              setQuery(value)
              setSelectedTitle(null)
            }}
            view={view}
            onViewChange={setView}
            onSettings={() => {
              setSectionId('profile')
              setSelectedTitle(null)
              setQuery('')
            }}
            onNotifications={() => setNotesOpen(true)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            {sectionId === 'profile' ? (
              <ProfilePage
                profile={profile}
                onSave={(next) => {
                  setProfile(next)
                  if (session) {
                    const updated = { ...session, name: next.name, email: next.email }
                    setSession(saveSession(updated))
                  }
                }}
              />
            ) : session?.role === 'ADMIN' && sectionId === 'dashboard' ? (
              <AdminDashboard loans={loans} fines={fines} />
            ) : session?.role === 'ADMIN' && sectionId === 'users' ? (
              <AdminUsers />
            ) : session?.role === 'ADMIN' ? (
              <section className="px-6" aria-label="Admin shell">
                <h2 className="text-lg font-semibold">{sectionId[0].toUpperCase() + sectionId.slice(1)}</h2>
                <p className="mt-1 text-sm text-muted">Signed in as {session.name}.</p>
              </section>
            ) : selectedBook ? (
              <ResourceDetail
                book={selectedBook}
                loans={loans}
                onBack={() => setSelectedTitle(null)}
                onBorrow={() => {
                  const result = borrowTitle(loans, selectedBook.title)
                  if (result.loans) setLoans(result.loans)
                }}
              />
            ) : sectionId === 'fines' ? (
              <FinesPage fines={fines} onPay={(fineId) => setFines(payFine(fines, fineId))} />
            ) : sectionId === 'reading-now' ? (
              <LoansPage
                loans={loans}
                onOpen={setSelectedTitle}
                onReturn={(loanId) => setLoans(returnLoan(loans, loanId))}
              />
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
          {notesOpen ? (
            <NotificationDrawer
              notes={notes}
              onClose={() => setNotesOpen(false)}
              onRead={(id) => setNotes((current) => current.map((note) => (note.id === id ? { ...note, read: true } : note)))}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default App
