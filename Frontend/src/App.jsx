import { useState } from 'react'
import AdminBorrows from './components/AdminBorrows.jsx'
import AdminCatalog from './components/AdminCatalog.jsx'
import AdminFines from './components/AdminFines.jsx'
import AdminRequirements from './components/AdminRequirements.jsx'
import AdminCopies from './components/AdminCopies.jsx'
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
import { bookByTitle, booksFor, loadCatalog, saveCatalog, searchCatalog, sectionLabels } from './data/catalog.js'
import { loadFines, payFine, waiveFine } from './data/fines.js'
import { fulfillRequirement, loadRequirements } from './data/requirements.js'
import { borrowTitle, loadLoans, returnLoan } from './data/loans.js'
import { clearSession, loadSession, register, saveSession, signIn } from './data/session.js'

const adminSections = ['dashboard', 'users', 'catalog', 'copies', 'borrows', 'fines', 'requirements']

function guardSection(role, sectionId) {
  if (sectionId === 'profile') return 'profile'
  const adminPage = adminSections.includes(sectionId)
  if (role === 'ADMIN') return adminPage ? sectionId : 'dashboard'
  return adminPage ? 'discover' : sectionId
}

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [sectionId, setSectionId] = useState('discover')
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [session, setSession] = useState(() => loadSession())
  const [loans, setLoans] = useState(() => loadLoans())
  const [fines, setFines] = useState(() => loadFines())
  const [books, setBooks] = useState(() => loadCatalog())
  const [requirements, setRequirements] = useState(() => loadRequirements())
  const [notesOpen, setNotesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
  const section = guardSection(session?.role, sectionId)

  function chooseSection(id) {
    setSectionId(id)
    setQuery('')
    setSelectedTitle(null)
    setMenuOpen(false)
  }

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
      <div className="relative flex h-[calc(100svh-1.5rem)] w-full overflow-hidden rounded-window bg-white shadow-window sm:h-[calc(100svh-2.5rem)] md:h-[calc(100svh-3rem)]">
        {menuOpen ? (
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 z-20 bg-navy/40 md:hidden" />
        ) : null}
        <Sidebar
          open={menuOpen}
          activeId={section}
          user={session}
          onAccount={() => setAuthMode('login')}
          activeLoan={activeLoan}
          onSignOut={() => {
            clearSession()
            setSession(null)
            setSectionId('discover')
            setMenuOpen(false)
          }}
          onSelect={chooseSection}
        />
        <main aria-label="Library window" className="relative flex min-w-0 flex-1 flex-col bg-white">
          <TopBar
            onMenu={() => setMenuOpen(true)}
            query={query}
            onQueryChange={(value) => {
              setQuery(value)
              setSelectedTitle(null)
            }}
            view={view}
            onViewChange={setView}
            onSettings={() => chooseSection('profile')}
            onNotifications={() => setNotesOpen(true)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            {section === 'profile' ? (
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
            ) : session?.role === 'ADMIN' && section === 'dashboard' ? (
              <AdminDashboard books={books} loans={loans} fines={fines} />
            ) : session?.role === 'ADMIN' && section === 'users' ? (
              <AdminUsers />
            ) : session?.role === 'ADMIN' && section === 'catalog' ? (
              <AdminCatalog books={books} onChange={(next) => setBooks(saveCatalog(next))} />
            ) : session?.role === 'ADMIN' && section === 'copies' ? (
              <AdminCopies books={books} loans={loans} onChange={(next) => setBooks(saveCatalog(next))} />
            ) : session?.role === 'ADMIN' && section === 'borrows' ? (
              <AdminBorrows loans={loans} />
            ) : session?.role === 'ADMIN' && section === 'fines' ? (
              <AdminFines fines={fines} onWaive={(fineId) => setFines(waiveFine(fines, fineId))} />
            ) : session?.role === 'ADMIN' && section === 'requirements' ? (
              <AdminRequirements
                requirements={requirements}
                onChange={setRequirements}
                onFulfill={(requirementId) => setRequirements(fulfillRequirement(requirements, requirementId))}
              />
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
            ) : section === 'fines' ? (
              <FinesPage fines={fines} onPay={(fineId) => setFines(payFine(fines, fineId))} />
            ) : section === 'reading-now' ? (
              <LoansPage
                loans={loans}
                onOpen={setSelectedTitle}
                onReturn={(loanId) => setLoans(returnLoan(loans, loanId))}
              />
            ) : searching ? (
              <SearchResults query={query} results={searchCatalog(query)} view={view} onOpen={setSelectedTitle} />
            ) : section !== 'discover' ? (
              <CategoryPage title={sectionLabels[section]} books={booksFor(section)} view={view} onOpen={setSelectedTitle} />
            ) : (
              <>
                <NewArrivals onOpen={setSelectedTitle} />
                <div className="mt-8 grid grid-cols-1 gap-6 px-6 md:grid-cols-[minmax(0,1fr)_220px]">
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
