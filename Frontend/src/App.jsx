import Sidebar from './components/Sidebar.jsx'

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas p-3 font-sans text-ink sm:p-5 md:p-6">
      <div className="flex h-[calc(100svh-1.5rem)] w-full overflow-hidden rounded-window bg-white shadow-window sm:h-[calc(100svh-2.5rem)] md:h-[calc(100svh-3rem)]">
        <Sidebar />
        <main aria-label="Library window" className="min-w-0 flex-1 bg-white" />
      </div>
    </div>
  )
}

export default App
