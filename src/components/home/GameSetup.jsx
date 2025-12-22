import { generateGameConfig, getOwnedBoards, getOwnedChars } from '@/game-logic/unmatched';
import { saveConfig } from '@/storage/config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// conditional mode selectio rendering functionality
// you cannot play tales to amaze with 5 players
// the selected game mode should be deselected if the number of players change and make that mode invalid

export default function GameSetup({ userConfig }) {
  // STATE
  const [modeId, setModeId] = useState(null);
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState(['Player 1']);

  // ROUTER
  const navigate = useNavigate();

  // DERIVED
  const validBoards = getOwnedBoards(userConfig.ownedSetIds)
    .filter((id) => !userConfig.bannedBoardIds.includes(id));

  const validCharacters = getOwnedChars(userConfig.ownedSetIds)
    .filter((id) => !userConfig.bannedCharacterIds.includes(id));

  // HELPER FUNCTIONS
  const talesBoardIds = ['mcminnville', 'point-pleasant'];
  const isTalesAvailable = () => talesBoardIds.some((id) => validBoards.includes(id));

  const talesAvailable = isTalesAvailable();
  const minPlayers = talesAvailable ? 1 : 2;
  const maxPlayers = talesAvailable ? 5 : 4;

  const gameModes = {
    '1v1': [2],
    '2v2': [4],
    ffa: talesAvailable ? [3, 4, 5] : [3, 4],
    tales: [1, 2, 3, 4],
  };

  // working on this

  // const getMaxPlayers = () => {
  //   let max = 1;

  //   validBoards.map((num, id) => {
  //     if (catalog.boards[id]?.maxPlayers > max) {
  //       max = num;
  //     }
  //   });

  //   return max;
  // };

  const setPlayerCount = (count) => {
    setNumPlayers(count);
    setPlayerNames((prev) => {
      const updated = [...prev];

      while (updated.length < count) {
        updated.push(`Player ${updated.length + 1}`);
      }

      return updated.slice(0, count);
    });
  };

  const isModeDisabled = (mode) => {
    if (!gameModes[mode].includes(numPlayers)) return true;
    if (validCharacters.length < numPlayers) return true;
    if (mode === 'tales' && (!talesAvailable || numPlayers > 4)) return true;
    return false;
  };

  // EVENT HANDLERS
  const updateNames = (e, i) => {
    const nameChange = e.target.value;

    setPlayerNames((prev) => {
      const names = [...prev];
      names[i] = nameChange;

      return names;
    });
  };

  const createGameConfig = () => {
    const config = generateGameConfig({
      userConfig, modeId, numPlayers, playerNames,
    });

    if (config.error) return;

    if (saveConfig('gameConfig', config)) navigate('/game');
  };

  return (
    <div className="game-setup-container">
      <div className="player-names">
        <h3>How many players?</h3>
        {playerNames.map((name, index) => (
          <div key={`player-${name}`} className="player-name-row">
            <label htmlFor={`player-${index}`}>
              Player
              {' '}
              {index + 1}
            </label>

            <input
              id={`player-${index}`}
              type="text"
              value={name}
              placeholder={`Player ${index + 1}`}
              onChange={(e) => updateNames(e, index)}
            />
          </div>
        ))}
        <button
          type="button"
          className="add-player"
          onClick={() => setPlayerCount(numPlayers + 1)}
          disabled={numPlayers >= maxPlayers}
        >
          Add Player
        </button>
        <button
          type="button"
          className="add-player"
          onClick={() => setPlayerCount(numPlayers - 1)}
          disabled={numPlayers <= minPlayers}
        >
          Remove Player
        </button>
      </div>
      <div className="mode-selection-container">
        <h3>Select Game Mode</h3>
        {Object.keys(gameModes).map((mode) => (
          <button
            key={mode}
            type="button"
            className={`mode-btn ${modeId === mode ? 'selected' : ''}`}
            onClick={() => setModeId(mode)}
            disabled={isModeDisabled(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={createGameConfig}
        disabled={!modeId}
      >
        Submit
      </button>
    </div>
  );
}
