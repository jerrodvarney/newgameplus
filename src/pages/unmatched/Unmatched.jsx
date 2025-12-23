import logo from '@/assets/logo.png';
import GameSetup from '@/components/home/GameSetup';
import Nav from '@/components/nav/Nav';
import { clearConfig, loadConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './unmatched.scss';

export default function Home() {
  // STATE
  const [userConfig, setUserConfig] = useState(null);

  // ROUTER
  const navigate = useNavigate();

  // EVENT HANDLERS
  const resetConfig = () => {
    clearConfig('userConfig');
    clearConfig('gameConfig');
    navigate('/setup');
  };

  // ON RENDER
  useEffect(() => {
    const config = loadConfig('userConfig');

    if (!config?.ownedSetIds.length) {
      navigate('/setup');
      return;
    }

    setUserConfig(config);
  }, [navigate]);

  return (
    <div id="home" className="page">
      <aside className="left">
        <Nav />
        {userConfig && <GameSetup userConfig={userConfig} />}
        <button type="button" onClick={resetConfig}>Start Over</button>
      </aside>
      <div className="right">
        <img src={logo} className="home-logo" alt="site logo" />
      </div>
    </div>
  );
}
