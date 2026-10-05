function Topbar({ onMenuClick }) {
  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <button
          className="app-topbar__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="app-topbar__right">
        {/* User menu / actions will be added in later phases */}
      </div>
    </header>
  );
}

export default Topbar;
