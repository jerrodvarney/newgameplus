import unmatchedLogo from '@/assets/unmatched.webp';
import Nav from '@/components/nav/Nav';
import { Link } from 'react-router-dom';
import './home.scss';

export default function Home() {
  return (
    <div id="home" className="page">
      <aside className="left">
        <Nav />
        <h3>
          Please select which game you want to use.
        </h3>
      </aside>
      <div className="right">
        <Link className="game-selector" to="/unmatched">
          <img src={unmatchedLogo} alt="unmatched mode selection" />
        </Link>
      </div>
    </div>
  );
}
