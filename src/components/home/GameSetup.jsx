import {
  generateGameConfig, getCapabilities,
} from '@/game-logic/unmatched';
import { saveConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// the selected game mode should be deselected if
// the number of players change and make that mode invalid

export default function GameSetup({ userConfig }) {
  // STATE
  const [modeId, setModeId] = useState(null);
  const [numPlayers, setNumPlayers] = useState(0);
  const [playerNames, setPlayerNames] = useState([]);
  const [modeCapabilities, setModeCapabilities] = useState(null);

  // ROUTER
  const navigate = useNavigate();

  // HELPER FUNCTIONS
  const setPlayerCount = (count) => {
    setNumPlayers(count);

    setPlayerNames((prev) => {
      const updated = [...prev];

      while (updated.length < count) {
        updated.push(`Player ${updated.length + 1}`);
      }

      return updated;
    });
  };

  // EVENT HANDLERS
  const updateMode = (id) => {
    if (id === '1v1') {
      setPlayerCount(2);
    } else if (id === '2v2') {
      setPlayerCount(4);
    } else {
      setPlayerCount(0);
    }

    setModeId(id);
  };

  const updateNames = (name, i) => {
    setPlayerNames((prev) => {
      const names = [...prev];

      names[i] = name;

      return names;
    });
  };

  const sanitizeNames = () => Array.from({ length: numPlayers }, (_, i) => {
    const name = playerNames[i]?.trim();
    return name || `Player ${i + 1}`;
  });

  const createGameConfig = () => {
    const sanitizedNames = sanitizeNames();

    const config = generateGameConfig({
      userConfig, modeId, numPlayers, playerNames: sanitizedNames,
    });

    if (config.error) return;

    if (saveConfig('gameConfig', config)) navigate('/game');
  };

  // updates mode selection capabilities on userConfig change
  useEffect(() => {
    const capabilities = getCapabilities(userConfig);

    setModeCapabilities(capabilities);
  }, [userConfig]);

  return (
    <div className="game-setup">

      {modeCapabilities && (
      <div className="mode-selection">
        <h3>Select Game Mode:</h3>
        <div className="mode-btns">
          {Object.entries(modeCapabilities.modes)
            .map(([key, mode]) => (
              <button
                key={key}
                type="button"
                className={`setup ${key === modeId ? 'selected' : null}`}
                onClick={() => updateMode(key)}
                disabled={!mode.enabled}
                title={mode.reason}
              >
                {mode.name}
              </button>
            ))}
        </div>
      </div>
      )}

      {modeId && (modeId !== '1v1' && modeId !== '2v2') && (
        <div className="player-count">
          <h3>How many are playing?</h3>
          <div className="player-btns">
            {modeCapabilities.modes[modeId].allowedPlayerCounts
              .map((count) => (
                <button
                  key={`${count}a`}
                  type="button"
                  className={`setup ${count === numPlayers ? 'selected' : null}`}
                  onClick={() => setPlayerCount(count)}
                  disabled={modeCapabilities.maxPlayers < count}
                >
                  {count}
                </button>
              ))}
          </div>
        </div>
      )}

      {numPlayers
        ? (
          <div className="player-names">
            <h3>Enter player names:</h3>
            <div className="name-inputs">
              {playerNames
                .slice(0, numPlayers)
                .map((name, i) => (
                  <input
                    key={`input${i}`} // eslint-disable-line react/no-array-index-key
                    type="text"
                    placeholder={`Player ${i + 1}`}
                    onChange={(e) => updateNames(e.target.value, i)}
                    value={name}
                  />
                ))}
            </div>
          </div>
        )
        : null}

      <div className="submit-container">
        <button type="button" onClick={createGameConfig} disabled={!modeId || numPlayers <= 0}>
          Submit
        </button>
      </div>

    </div>
  );
}
