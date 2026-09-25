function NotificationDrawer({ notes, onClose, onRead }) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-80 max-w-full flex-col border-l border-slate-100 bg-white shadow-window">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button type="button" onClick={onClose} className="text-sm text-muted">
          Close
        </button>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {notes.map((note) => (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => onRead(note.id)}
              className={`w-full px-4 py-3 text-left ${note.read ? 'text-muted' : 'bg-field/70'}`}
            >
              <p className="text-sm font-medium text-ink">{note.title}</p>
              <p className="mt-1 text-xs">{note.message}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationDrawer
