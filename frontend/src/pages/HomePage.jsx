import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1 className="home-page__brand">Archivalia</h1>
      <p className="home-page__tagline">
        Enterprise Academic E-Library &amp; Digital Resource Circulation System
      </p>
      <div className="home-page__actions">
        <Link to="/login" className="home-page__btn home-page__btn--primary">
          Sign In
        </Link>
        <Link to="/register" className="home-page__btn home-page__btn--secondary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
