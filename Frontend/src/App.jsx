import { useEffect, useState } from 'react'
import AdminBorrows from './components/AdminBorrows.jsx'
import AdminCatalog from './components/AdminCatalog.jsx'
import AdminFines from './components/AdminFines.jsx'
import AdminRequirements from './components/AdminRequirements.jsx'
import AdminCopies from './components/AdminCopies.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import AdminUsers from './components/AdminUsers.jsx'
import AdminDiscovery from './components/AdminDiscovery.jsx'
import AiResearchAssistant from './components/AiResearchAssistant.jsx'
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
import { bookByTitle, booksFor, fetchCatalogFromBackend, loadCatalog, saveCatalog, searchCatalog, sectionLabels } from './data/catalog.js'
import { createFineAsync, fetchFinesFromBackend, loadFines, payFineAsync, waiveFineAsync } from './data/fines.js'
import { fetchRequirementsFromBackend, fulfillRequirementAsync, loadRequirements } from './data/requirements.js'
import { borrowTitleAsync, fetchLoansFromBackend, loadLoans, returnLoanAsync } from './data/loans.js'
import { fetchNotificationsFromBackend, loadNotifications, markAllNotificationsReadAsync, markNotificationReadAsync } from './data/notifications.js'
import { clearSession, loadSession, register, saveSession, signIn } from './data/session.js'
import { authApi } from './services/api.js'

const adminOnlySections = ['dashboard', 'users', 'catalog', 'copies', 'borrows', 'requirements', 'discovery']
const adminAllowedSections = [...adminOnlySections, 'fines', 'profile', 'ai-research']

function guardSection(role, sectionId) {
  if (role === 'ADMIN') {
    return adminAllowedSections.includes(sectionId) ? sectionId : 'dashboard'
  }
  return adminOnlySections.includes(sectionId) ? 'discover' : sectionId
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
  const [notes, setNotes] = useState(() => loadNotifications())
  const [profile, setProfile] = useState(() => {
    const current = loadSession()
    return {
      name: current?.name || 'Ben Bradle',
      userId: current?.role === 'ADMIN' ? 'ADM-001' : 'USR-101',
      email: current?.email || 'user@archivalia.test',
      phone: '9876543210',
    }
  })

  useEffect(() => {
    let ignore = false
    async function initData() {
      const liveBooks = await fetchCatalogFromBackend()
      if (!ignore && liveBooks && liveBooks.length > 0) {
        setBooks(liveBooks)
      }
      const liveReqs = await fetchRequirementsFromBackend()
      if (!ignore && liveReqs && liveReqs.length > 0) {
        setRequirements(liveReqs)
      }
      const liveLoans = await fetchLoansFromBackend(session)
      if (!ignore && liveLoans && liveLoans.length > 0) {
        setLoans(liveLoans)
      }
      const liveFines = await fetchFinesFromBackend(session)
      if (!ignore && liveFines && liveFines.length > 0) {
        setFines(liveFines)
      }
      const liveNotes = await fetchNotificationsFromBackend(session)
      if (!ignore && liveNotes && liveNotes.length > 0) {
        setNotes(liveNotes)
      }
    }
    initData()
    return () => {
      ignore = true
    }
  }, [session])

  const activeLoan = loans.find((loan) => !loan.returnedAt)
  const searching = query.trim().length > 0
  const selectedBook = books.find((b) => b.title === selectedTitle) || bookByTitle(selectedTitle)
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
        onSignIn={async (email, password) => enter(await signIn(email, password))}
        onRegister={async (name, email, password) => enter(await register(name, email, password))}
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
            unreadNotes={notes.filter((n) => !n.read).length}
          />
          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            {section === 'profile' ? (
              <ProfilePage
                profile={profile}
                onSave={async (next) => {
                  setProfile(next)
                  if (session) {
                    const updated = { ...session, name: next.name, email: next.email }
                    setSession(saveSession(updated))
                    await authApi.updateProfile(next.name, next.email, next.phone)
                  }
                }}
              />
            ) : session?.role === 'ADMIN' && section === 'dashboard' ? (
              <AdminDashboard books={books} loans={loans} fines={fines} requirements={requirements} onSelectSection={chooseSection} />
            ) : session?.role === 'ADMIN' && section === 'users' ? (
              <AdminUsers />
            ) : session?.role === 'ADMIN' && section === 'catalog' ? (
              <AdminCatalog books={books} onChange={(next) => setBooks(saveCatalog(next))} />
            ) : session?.role === 'ADMIN' && section === 'copies' ? (
              <AdminCopies books={books} loans={loans} onChange={(next) => setBooks(saveCatalog(next))} />
            ) : session?.role === 'ADMIN' && section === 'borrows' ? (
              <AdminBorrows loans={loans} />
            ) : session?.role === 'ADMIN' && section === 'fines' ? (
              <AdminFines fines={fines} onWaive={async (fineId) => setFines(await waiveFineAsync(fines, fineId, session || profile))} />
            ) : session?.role === 'ADMIN' && section === 'requirements' ? (
              <AdminRequirements
                requirements={requirements}
                onChange={setRequirements}
                onFulfill={async (requirementId) => setRequirements(await fulfillRequirementAsync(requirements, requirementId))}
              />
            ) : session?.role === 'ADMIN' && section === 'discovery' ? (
              <AdminDiscovery
                onCatalogRefresh={async () => {
                  const refreshed = await fetchCatalogFromBackend()
                  if (refreshed && refreshed.length > 0) setBooks(refreshed)
                }}
              />
            ) : section === 'ai-research' ? (
              <AiResearchAssistant
                user={session || profile}
                onSearchKeyword={(keyword) => {
                  setQuery(keyword)
                  setSectionId('discover')
                }}
              />
            ) : selectedBook ? (
              <ResourceDetail
                book={selectedBook}
                loans={loans}
                onBack={() => setSelectedTitle(null)}
                onBorrow={async () => {
                  const result = await borrowTitleAsync(loans, selectedBook.title, session || profile)
                  if (result.loans) setLoans(result.loans)
                  const refreshed = await fetchCatalogFromBackend()
                  if (refreshed && refreshed.length > 0) setBooks(refreshed)
                  const refreshedFines = await fetchFinesFromBackend(session)
                  if (refreshedFines && refreshedFines.length > 0) setFines(refreshedFines)
                }}
              />
            ) : section === 'fines' ? (
              <FinesPage
                fines={fines}
                onPay={async (fineId, paymentData) => setFines(await payFineAsync(fines, fineId, session || profile, paymentData))}
                onCreateDemo={async () => setFines(await createFineAsync({ title: 'Refactoring (Martin Fowler)', amount: 35, reason: 'Returned 2 days late' }, session || profile))}
              />
            ) : section === 'reading-now' ? (
              <LoansPage
                loans={loans}
                onOpen={setSelectedTitle}
                onReturn={async (loanId) => {
                  const nextLoans = await returnLoanAsync(loans, loanId, session || profile)
                  setLoans(nextLoans)
                  const refreshed = await fetchCatalogFromBackend()
                  if (refreshed && refreshed.length > 0) setBooks(refreshed)
                  const refreshedFines = await fetchFinesFromBackend(session)
                  if (refreshedFines && refreshedFines.length > 0) setFines(refreshedFines)
                }}
              />
            ) : searching ? (
              <SearchResults query={query} results={searchCatalog(query, books)} view={view} onOpen={setSelectedTitle} />
            ) : section !== 'discover' ? (
              <CategoryPage title={sectionLabels[section]} books={booksFor(section, books)} view={view} onOpen={setSelectedTitle} />
            ) : (
              <>
                <NewArrivals onOpen={setSelectedTitle} />
                <div className="mt-8 grid grid-cols-1 gap-6 px-6 md:grid-cols-[minmax(0,1fr)_220px]">
                  <ForYou onOpen={setSelectedTitle} user={session || profile} />
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
              onRead={async (id) => setNotes(await markNotificationReadAsync(notes, id))}
              onMarkAll={async () => setNotes(await markAllNotificationsReadAsync(notes, session || profile))}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default App
