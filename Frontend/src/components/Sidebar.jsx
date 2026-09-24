const sections = [
  {
    id: 'library',
    label: 'Your library',
    items: [
      { id: 'ebooks', label: 'E-books', icon: 'book' },
      { id: 'papers', label: 'Papers', icon: 'document' },
      { id: 'videos', label: 'Videos', icon: 'play' },
      { id: 'audio', label: 'Audio', icon: 'audio' },
      { id: 'physical', label: 'Physical', icon: 'copy' },
    ],
  },
  {
    id: 'lists',
    label: 'Your lists',
    items: [
      { id: 'due-soon', label: 'Due soon', icon: 'dot' },
      { id: 'reading-now', label: 'Reading now', icon: 'dot' },
      { id: 'saved', label: 'Saved', icon: 'dot' },
    ],
  },
  {
    id: 'collections',
    label: 'Collections',
    items: [
      { id: 'history', label: 'History of Science', swatch: 'from-sky-400 to-blue-700' },
      { id: 'quiet', label: 'Quiet reading', swatch: 'from-emerald-300 to-teal-700' },
      { id: 'research', label: 'Research papers', swatch: 'from-amber-300 to-orange-700' },
      { id: 'classics', label: 'Classic fiction', swatch: 'from-rose-300 to-red-800' },
    ],
  },
]

function Sidebar({ activeId, onSelect, onAccount }) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-navy text-white">
      <button type="button" onClick={onAccount} className="flex items-center gap-3 px-5 pb-3 pt-4 text-left">
        <span className="flex size-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
          BB
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">Ben Bradle</span>
        <ChevronIcon />
      </button>

      <nav className="min-h-0 flex-1 overflow-y-auto pb-2" aria-label="Library">
        <NavButton
          active={activeId === 'discover'}
          icon="spark"
          label="Discover"
          onClick={() => onSelect('discover')}
        />

        {sections.map((section) => (
          <div key={section.id}>
            <p className="px-5 pb-1 pt-3 text-[13px] font-medium text-white/45">{section.label}</p>
            {section.items.map((item) => (
              <NavButton
                key={item.id}
                active={activeId === item.id}
                icon={item.icon}
                label={item.label}
                swatch={item.swatch}
                onClick={() => onSelect(item.id)}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl bg-navy-raised px-2.5 py-2">
        <span className="size-9 shrink-0 rounded-md bg-linear-to-br from-sky-400 to-blue-700" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">The Design of Everyday Things</p>
          <p className="truncate text-[11px] text-white/50">Due in 4 days</p>
        </div>
        <span className="size-2 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
      </div>
    </aside>
  )
}

function NavButton({ active, icon, label, swatch, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 px-5 py-1.5 text-left text-sm ${
        active ? 'bg-navy-raised text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      {active ? <span className="absolute inset-y-0 left-0 w-1 bg-cyan" /> : null}
      {swatch ? (
        <span className={`size-6 shrink-0 rounded-md bg-linear-to-br ${swatch}`} />
      ) : (
        <ItemIcon name={icon} />
      )}
      <span className="truncate">{label}</span>
    </button>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 text-white/50" fill="none" aria-hidden="true">
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ItemIcon({ name }) {
  if (name === 'dot') {
    return <span className="mx-1.5 size-1.5 shrink-0 rounded-full bg-current opacity-70" />
  }

  const paths = {
    spark: 'M10 3.5 11.2 8 15.5 9.2 11.2 10.4 10 15 8.8 10.4 4.5 9.2 8.8 8 10 3.5Z',
    book: 'M5 4.5h7.5A2.5 2.5 0 0 1 15 7v8.5H7.5A2.5 2.5 0 0 0 5 18V4.5Z M5 4.5A2.5 2.5 0 0 1 7.5 7H15',
    document: 'M7 3.5h4.2L15 7.2V16.5H7V3.5Z M11 3.8V7.2H14.5',
    play: 'M8 6.5v7l6-3.5-6-3.5Z',
    audio: 'M6 10.5a4 4 0 0 1 8 0 M8 10.5a2 2 0 0 1 4 0 M10 14.5v2',
    copy: 'M7 6.5h8v9H7v-9Z M5 8.5v9h8',
  }

  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default Sidebar
