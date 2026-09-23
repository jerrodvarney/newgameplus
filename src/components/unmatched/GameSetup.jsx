import {
  generateGameConfig, getCapabilities,
} from '@/game-logic/unmatched';
import { loadConfig, saveConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function GameSetup({ userConfig, resetConfig }) {
  // STATE
  // lazy initializers restore any in-progress setup directly on mount, so
  // there's never a blank-state render that a persist effect could clobber
  // the saved data with (a plain restore-then-persist effect pair races here).
  const [modeId, setModeId] = useState(() => loadConfig('playerSetup')?.modeId ?? null);
  const [numPlayers, setNumPlayers] = useState(() => loadConfig('playerSetup')?.numPlayers ?? 0);
  const [playerNames, setPlayerNames] = useState(() => loadConfig('playerSetup')?.playerNames ?? []);
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
    if (modeId === id) return;

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

  // DERIVED VALUES
  const enteredNames = playerNames
    .slice(0, numPlayers)
    .map((name) => name?.trim().toLowerCase())
    .filter(Boolean);
  const hasDuplicateNames = new Set(enteredNames).size !== enteredNames.length;

  const createGameConfig = () => {
    if (hasDuplicateNames) return;

    const sanitizedNames = sanitizeNames();

    const config = generateGameConfig({
      userConfig, modeId, numPlayers, playerNames: sanitizedNames,
    });

    if (config.error) return;

    if (saveConfig('gameConfig', config)) navigate('/game');
  };

  // persists mode/player setup as it changes, so it survives navigating away and back
  useEffect(() => {
    saveConfig('playerSetup', { modeId, numPlayers, playerNames });
  }, [modeId, numPlayers, playerNames]);

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

      {modeCapabilities && modeId && (modeId !== '1v1' && modeId !== '2v2') && (
        <div className="player-count">
          <h3>How many are playing?</h3>
          <div className="player-btns">
            {modeCapabilities.modes[modeId].allowedPlayerCounts
              .filter((count) => modeCapabilities.maxPlayers >= count)
              .map((count) => (
                <button
                  key={`${count}a`}
                  type="button"
                  className={`setup ${count === numPlayers ? 'selected' : null}`}
                  onClick={() => setPlayerCount(count)}
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
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="name-input-row" key={`input${i}`}>
                    <input
                      type="text"
                      placeholder={`Player ${i + 1}`}
                      onChange={(e) => updateNames(e.target.value, i)}
                      value={name}
                      maxLength={20}
                    />
                    {name && (
                      <button
                        type="button"
                        className="name-clear-btn"
                        onClick={() => updateNames('', i)}
                        aria-label={`Clear name for player ${i + 1}`}
                      >
                        <IoClose size="1.1rem" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
            {hasDuplicateNames && (
              <div className="name-warning" role="alert">
                Two or more players have the same name. Please make sure every name is unique.
              </div>
            )}
          </div>
        )
        : null}

      <div className="submit-container">
        <button
          type="button"
          className="submit-btn"
          onClick={createGameConfig}
          disabled={!modeId || numPlayers <= 0 || hasDuplicateNames}
        >
          Submit
        </button>
        <button type="button" className="submit-btn" onClick={resetConfig}>Edit Sets & Bans</button>
      </div>

    </div>
  );
}
