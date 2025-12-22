import catalog from '@/catalog';
import Nav from '@/components/nav/Nav';
import SetSelector from '@/components/setup/SetSelector';
import { saveConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './setup.scss';

// TODO
// users can changes owned sets and bans at any time
// if a user alreadyt has a config in local storage,
// need to render cards pre selected and bans auto applied (if any)

export default function Setup() {
  // STATE
  const [selectedSets, setSelectedSets] = useState([]);
  const [bannedBoards, setBannedBoards] = useState([]);
  const [bannedChars, setBannedChars] = useState([]);
  const [banBoards, setBanBoards] = useState(false);
  const [banChars, setBanChars] = useState(false);

  // ROUTER
  const navigate = useNavigate();

  // EVENT HANDLERS
  const toggleSet = (setId) => {
    setSelectedSets((prev) => (prev.includes(setId)
      ? prev.filter((id) => id !== setId)
      : [...prev, setId]));
  };

  const toggleBannedBoards = (boardId) => {
    setBannedBoards((prev) => (prev.includes(boardId)
      ? prev.filter((id) => id !== boardId)
      : [...prev, boardId]));
  };

  const toggleBannedChars = (charId) => {
    setBannedChars((prev) => (prev.includes(charId)
      ? prev.filter((id) => id !== charId)
      : [...prev, charId]));
  };

  const submitSetup = () => {
    const config = {
      gameId: 'unmatched',
      ownedSetIds: selectedSets,
      bannedBoardIds: banBoards ? bannedBoards : [],
      bannedCharacterIds: banChars ? bannedChars : [],
    };

    const status = saveConfig('userConfig', config);

    if (status) navigate('/');
  };

  // Cleans up bans with set selection
  useEffect(() => {
    const ownedBoards = new Set(
      selectedSets.flatMap((setId) => catalog.sets[setId]?.boardIds ?? []),
    );

    const ownedChars = new Set(
      selectedSets.flatMap((setId) => catalog.sets[setId]?.characterIds ?? []),
    );

    setBannedBoards((prev) => prev.filter((id) => ownedBoards.has(id)));
    setBannedChars((prev) => prev.filter((id) => ownedChars.has(id)));
  }, [selectedSets]);

  return (
    <div id="setup" className="page">
      <aside className="left">
        <Nav />
        <div className="side-container">
          <h1>Welcome to NewGame+</h1>
          <p>
            Please select which sets you own.
            <br />
            Then select which characters or boards to ban from play (if any).
            <br />
            You can update these settings at any time.
          </p>
        </div>
        {selectedSets.length > 0 && (
          <div className="setup-ban-container">
            <div className="setup-ban-section">
              <p>Would you like to ban any boards?</p>
              <button
                className="ban-btn"
                type="button"
                onClick={() => setBanBoards(!banBoards)}
              >
                {banBoards
                  ? 'No'
                  : 'Yes'}
              </button>
              {banBoards
              && selectedSets
                .flatMap((setId) => catalog.sets[setId]?.boardIds ?? [])
                .map((boardId) => (
                  <button
                    key={boardId}
                    type="button"
                    onClick={() => toggleBannedBoards(boardId)}
                  >
                    {catalog.boards[boardId].name}
                  </button>
                ))}
            </div>
            <div className="setup-ban-section">
              <p>Would you like to ban any characters?</p>
              <button
                className="ban-btn"
                type="button"
                onClick={() => setBanChars(!banChars)}
              >
                {banChars
                  ? 'No'
                  : 'Yes'}
              </button>
              {banChars
              && selectedSets
                .flatMap((setId) => catalog.sets[setId]?.characterIds ?? [])
                .map((charId) => (
                  <button
                    key={charId}
                    type="button"
                    onClick={() => toggleBannedChars(charId)}
                  >
                    {catalog.characters[charId].name}
                  </button>
                ))}
            </div>
          </div>
        )}
        <div className="setup-submit-container">
          <button type="button" onClick={submitSetup}>Submit</button>
        </div>
      </aside>
      <div className="right set-selection">
        {Object.values(catalog.sets)
          .map((set) => (
            <SetSelector
              key={set.id}
              setInfo={set}
              updateSelected={() => toggleSet(set.id)}
            />
          ))}
      </div>
    </div>
  );
}
