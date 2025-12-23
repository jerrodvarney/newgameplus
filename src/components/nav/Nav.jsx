import logo from '@/assets/logo.png';
import { useState } from 'react';
import { IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import './nav.scss';

export default function Nav() {
  // STATE
  const [navOpen, setNavState] = useState(false);

  return (
    <div id="nav">
      <button
        type="button"
        className="nav-menu-btn"
        onClick={() => setNavState((nav) => !nav)}
        aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={navOpen}
      >
        <IoMenu size="2rem" />
      </button>
      <div className={`nav-menu ${navOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/unmatched">Unmatched</Link>
        <Link to="/setup">Setup</Link>
        <Link to="/game">My Game</Link>
      </div>
      <Link className="nav-logo" to="/">
        <img src={logo} alt="The website logo." />
      </Link>
    </div>
  );
}
