import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`app-sidebar${isOpen ? ' app-sidebar--open' : ''}`}>
      <div className="app-sidebar__brand">
        <span className="app-sidebar__brand-name">Archivalia</span>
      </div>

      <nav className="app-sidebar__nav" aria-label="Main navigation">
        {/* Navigation links will be populated in later phases */}
      </nav>

      <div className="app-sidebar__footer">
        &copy; {new Date().getFullYear()} Archivalia
      </div>
    </aside>
  );
}

export default Sidebar;
