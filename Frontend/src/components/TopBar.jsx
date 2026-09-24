function TopBar({ query, onQueryChange, view, onViewChange }) {
  return (
    <header className="flex items-center gap-4 px-6 py-4">
      <label className="flex h-10 w-full max-w-sm items-center gap-2 rounded-full bg-field px-4 text-muted">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <IconButton
          label="Grid view"
          active={view === 'grid'}
          onClick={() => onViewChange('grid')}
        >
          <GridIcon />
        </IconButton>
        <IconButton
          label="List view"
          active={view === 'list'}
          onClick={() => onViewChange('list')}
        >
          <ListIcon />
        </IconButton>
        <span className="mx-2 h-5 w-px bg-slate-200" />
        <IconButton label="Settings">
          <GearIcon />
        </IconButton>
        <IconButton label="Notifications">
          <BellIcon />
        </IconButton>
      </div>
    </header>
  )
}

function IconButton({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-lg ${
        active ? 'bg-field text-ink' : 'text-muted hover:bg-field hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.2 13.2 16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="3.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.5" y="11.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="11.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 3.5v1.8M10 14.7v1.8M3.5 10h1.8M14.7 10h1.8M5.4 5.4l1.3 1.3M13.3 13.3l1.3 1.3M14.6 5.4l-1.3 1.3M6.7 13.3l-1.3 1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M6 8.5a4 4 0 0 1 8 0c0 3 1.2 4 1.2 4H4.8S6 11.5 6 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.5 15.2a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default TopBar
