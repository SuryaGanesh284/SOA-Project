function NotificationDrawer({ notes, onClose, onRead, onMarkAll }) {
  const unreadCount = notes.filter((n) => !n.read).length

  function typeBadge(type) {
    switch (type) {
      case 'LOAN_DUE':
        return <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Due Soon</span>
      case 'LOAN_RETURN':
        return <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Returned</span>
      case 'FINE_PAYMENT':
        return <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">Payment</span>
      default:
        return <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">Notice</span>
    }
  }

  return (
    <div className="absolute inset-y-0 right-0 z-30 flex w-84 max-w-full flex-col border-l border-slate-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-ink">Notifications</h2>
            {unreadCount > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                {unreadCount}
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted">Library circulation and account alerts</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-sm text-muted hover:bg-slate-100 hover:text-ink"
        >
          ✕
        </button>
      </div>

      {/* Quick Action Bar */}
      {unreadCount > 0 && onMarkAll ? (
        <div className="flex items-center justify-end bg-slate-50/70 px-5 py-2">
          <button
            type="button"
            onClick={onMarkAll}
            className="text-xs font-semibold text-navy hover:underline"
          >
            Mark all as read
          </button>
        </div>
      ) : null}

      {/* Notifications List */}
      <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto">
        {notes.length === 0 ? (
          <li className="flex flex-col items-center justify-center py-16 text-center text-muted">
            <p className="text-sm font-medium text-ink">No notifications</p>
            <p className="mt-1 text-xs">You are all caught up!</p>
          </li>
        ) : (
          notes.map((note) => (
            <li key={note.id || note.notificationCode}>
              <button
                type="button"
                onClick={() => onRead(note.id || note.notificationCode)}
                className={`relative w-full px-5 py-3.5 text-left transition-colors ${
                  note.read ? 'bg-white hover:bg-slate-50' : 'bg-navy/5 hover:bg-navy/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!note.read ? (
                      <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                    ) : null}
                    <span className={`text-sm font-semibold ${note.read ? 'text-slate-600' : 'text-ink'}`}>
                      {note.title}
                    </span>
                  </div>
                  {typeBadge(note.type)}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">{note.message}</p>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default NotificationDrawer
