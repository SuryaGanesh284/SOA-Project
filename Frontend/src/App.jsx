import { useState } from 'react'
import Collections from './components/Collections.jsx'
import ForYou from './components/ForYou.jsx'
import NewArrivals from './components/NewArrivals.jsx'
import SearchResults from './components/SearchResults.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Trending from './components/Trending.jsx'
import { searchCatalog } from './data/catalog.js'

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const searching = query.trim().length > 0

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas p-3 font-sans text-ink sm:p-5 md:p-6">
      <div className="flex h-[calc(100svh-1.5rem)] w-full overflow-hidden rounded-window bg-white shadow-window sm:h-[calc(100svh-2.5rem)] md:h-[calc(100svh-3rem)]">
        <Sidebar />
        <main aria-label="Library window" className="flex min-w-0 flex-1 flex-col bg-white">
          <TopBar query={query} onQueryChange={setQuery} view={view} onViewChange={setView} />
          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            {searching ? (
              <SearchResults query={query} results={searchCatalog(query)} view={view} />
            ) : (
              <>
                <NewArrivals />
                <div className="mt-8 grid grid-cols-[minmax(0,1fr)_220px] gap-6 px-6">
                  <ForYou />
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
