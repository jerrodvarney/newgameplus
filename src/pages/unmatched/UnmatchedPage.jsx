import logo from '@/assets/logo.png';
import Nav from '@/components/nav/Nav';
import GameSetup from '@/components/unmatched/GameSetup';
import { clearConfig, loadConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './unmatched-page.scss';

export default function UnmatchedPage() {
  // STATE
  const [userConfig, setUserConfig] = useState(null);

  // ROUTER
  const navigate = useNavigate();

  // EVENT HANDLERS
  const resetGameConfig = () => {
    clearConfig('gameConfig');
    navigate('/setup');
  };

  // ON MOUNT: load userConfig or bounce to setup
  useEffect(() => {
    const config = loadConfig('userConfig');

    const hasOwnedSets = Array.isArray(config?.ownedSetIds) && config.ownedSetIds.length > 0;

    if (!hasOwnedSets) {
      navigate('/setup', { replace: true });
      return;
    }

    setUserConfig(config);
  }, [navigate]);

  return (
    <div id="unmatched" className="page">
      <aside className="left">
        <Nav />
        {userConfig && (
          <GameSetup
            userConfig={userConfig}
            resetConfig={resetGameConfig}
          />
        )}
      </aside>

      <main className="right">
        <img src={logo} className="home-logo" alt="NewGame+ logo" />
      </main>
    </div>
  );
}
