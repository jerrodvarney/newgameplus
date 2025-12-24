import catalog from '@/catalog';
import Nav from '@/components/nav/Nav';
import SetSelector from '@/components/setup/SetSelector';
import { getOwnedBoards, getOwnedChars, pruneBans } from '@/game-logic/unmatched';
import { loadConfig, saveConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './setup.scss';

export default function Setup() {
  // STATE
  const [selectedSets, setSelectedSets] = useState([]);
  const [bannedBoards, setBannedBoards] = useState({});
  const [bannedChars, setBannedChars] = useState({});
  const [banBoards, setBanBoards] = useState(false);
  const [banChars, setBanChars] = useState(false);

  // ROUTER
  const navigate = useNavigate();

  // HELPER FUNCTIONS
  const toggleSet = (setId) => {
    setSelectedSets((prev) => (prev.includes(setId)
      ? prev.filter((id) => id !== setId)
      : [...prev, setId]));
  };

  const toggleBannedBoards = (boardId) => {
    setBannedBoards((prev) => {
      if (prev[boardId]) {
        const { [boardId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [boardId]: true };
    });
  };

  const toggleBannedChars = (charId) => {
    setBannedChars((prev) => {
      if (prev[charId]) {
        const { [charId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [charId]: true };
    });
  };

  const quickSelect = (bool) => {
    if (bool) setSelectedSets(Object.keys(catalog.sets));
    else setSelectedSets([]);
  };

  // EVENT HANDLERS
  const submitSetup = () => {
    const validBoards = getOwnedBoards(selectedSets);
    const validChars = getOwnedChars(selectedSets);

    const config = {
      gameId: 'unmatched',
      ownedSetIds: selectedSets,
      bannedBoardIds: banBoards ? pruneBans(bannedBoards, validBoards) : {},
      bannedCharacterIds: banChars ? pruneBans(bannedChars, validChars) : {},
    };

    const status = saveConfig('userConfig', config);

    if (status) navigate('/');
  };

  // ON RENDER
  useEffect(() => {
    const config = loadConfig('userConfig');

    if (config) {
      setSelectedSets(config.ownedSetIds);

      if (Object.keys(config.bannedBoardIds).length) {
        setBannedBoards(config.bannedBoardIds);
        setBanBoards(true);
      }

      if (Object.keys(config.bannedCharacterIds).length) {
        setBannedChars(config.bannedCharacterIds);
        setBanChars(true);
      }
    }
  }, []);

  return (
    <div id="setup" className="page">
      <aside className="left setup-left">
        <Nav />
        <div className="setup-container">
          <div className="side-container">
            <h1>Welcome to NewGame+</h1>
            <p>Please select which sets you own.</p>
            <p> Then select which characters or boards to ban from play (if any).</p>
            <p>You can update these settings at any time.</p>
          </div>
          {selectedSets.length > 0 && (
          <div className="setup-ban-container">

            <div className="setup-ban-section">
              <div className="ban-top">
                <h3>Would you like to ban any boards?</h3>
                <button
                  className="ban-btn"
                  type="button"
                  onClick={() => setBanBoards(!banBoards)}
                >
                  {banBoards
                    ? 'No'
                    : 'Yes'}
                </button>
              </div>
              {banBoards
              && (
                <div className="ban-btns">
                  {selectedSets
                    .flatMap((setId) => catalog.sets[setId]?.boardIds ?? [])
                    .map((boardId) => (
                      <button
                        key={boardId}
                        type="button"
                        className={bannedBoards[boardId] ? 'selected-btn' : null}
                        onClick={() => toggleBannedBoards(boardId)}
                      >
                        {catalog.boards[boardId].name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="setup-ban-section">
              <div className="ban-top">
                <h3>Would you like to ban any characters?</h3>
                <button
                  className="ban-btn"
                  type="button"
                  onClick={() => setBanChars(!banChars)}
                >
                  {banChars
                    ? 'No'
                    : 'Yes'}
                </button>
              </div>
              {banChars
              && (
                <div className="ban-btns">
                  {selectedSets
                    .flatMap((setId) => catalog.sets[setId]?.characterIds ?? [])
                    .map((charId) => (
                      <button
                        key={charId}
                        type="button"
                        className={bannedChars[charId] ? 'selected-btn' : null}
                        onClick={() => toggleBannedChars(charId)}
                      >
                        {catalog.characters[charId]?.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          )}

          <div className="setup-submit-container">
            <button type="button" className="submit-btn" onClick={() => quickSelect(true)}>Select All</button>
            <button type="button" className="submit-btn" onClick={() => quickSelect(false)}>Deselect All</button>
            <button type="button" className="submit-btn" onClick={submitSetup}>Submit</button>
          </div>

        </div>
      </aside>

      <div className="right set-selection">
        {Object.values(catalog.sets)
          .map((set) => (
            <SetSelector
              key={set.id}
              setInfo={set}
              updateSelected={() => toggleSet(set.id)}
              selectedSets={selectedSets}
            />
          ))}
      </div>
    </div>
  );
}
