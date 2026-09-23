import catalog from '@/catalog';
import CharacterCard from '@/components/game/CharacterCard';
import GameCard from '@/components/game/GameCard';
import PlayerCard from '@/components/game/PlayerCard';
import VillainMatchup from '@/components/game/VillainMatchup';
import Nav from '@/components/nav/Nav';
import { generateGameConfig } from '@/game-logic/unmatched';
import { clearConfig, loadConfig, saveConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './game-page.scss';

// HELPER FUNCTIONS
const isValidGameConfig = (config) => config
    && config.modeId
    && config.numPlayers
    && config.boardId
    && config.players?.length > 0;

export default function Game() {
  // STATE
  const [gameConfig, setGameConfig] = useState(null);

  // DERIVED VALUES
  const gameBoard = gameConfig ? catalog.boards[gameConfig.boardId] : null;
  const gameVillain = gameConfig?.villainId ? catalog.villains[gameConfig.villainId] : null;
  const gameMinions = gameConfig?.minionIds
    ?.map((id) => catalog.minions[id])
    .filter(Boolean) ?? [];
  const isDuel = gameConfig?.modeId === '1v1' && gameConfig.players.length === 2;
  const isTeamMode = gameConfig?.modeId === '2v2';
  const teamOnePlayers = isTeamMode ? gameConfig.players.filter((p) => p.team === 1) : [];
  const teamTwoPlayers = isTeamMode ? gameConfig.players.filter((p) => p.team === 2) : [];

  // ROUTER
  const navigate = useNavigate();

  // EVENT HANDLERS
  const startNewGame = () => {
    clearConfig('gameConfig');
    navigate('/');
  };

  const rerollGame = () => {
    if (!isValidGameConfig(gameConfig)) {
      clearConfig('gameConfig');
      navigate('/');
      return;
    }

    const userConfig = loadConfig('userConfig');
    if (!userConfig) {
      navigate('/setup');
      return;
    }

    const { modeId, numPlayers, players } = gameConfig;

    const playerNames = players.map((player) => player.name);
    const newConfig = generateGameConfig({
      userConfig,
      modeId,
      numPlayers,
      playerNames,
    });

    saveConfig('gameConfig', newConfig);
    setGameConfig(newConfig);
  };

  // ON RENDER
  useEffect(() => {
    const config = loadConfig('gameConfig');

    if (!config) {
      navigate('/');
      return;
    }

    setGameConfig(config);
  }, [navigate]);

  return (
    <div id="home" className="page">
      <aside id="game-left" className="left">
        <Nav />
        {gameConfig && (
        <GameCard
          gameConfig={gameConfig}
          board={gameBoard}
        />
        )}
        <div className="player-card-container">
          <h3>Turn Order</h3>
          {gameConfig?.players
            .map((player, i) => (
              <PlayerCard
                key={player.name}
                player={player}
                character={catalog.characters[player.characterId]}
                i={i}
              />
            ))}
        </div>
        <div className="game-reset-btns">
          <button type="button" className="game-btn" onClick={rerollGame} disabled={!gameConfig}>Re-Roll</button>
          <button type="button" className="game-btn" onClick={startNewGame}>Start New Game</button>
        </div>
      </aside>
      <div id="game-right" className="right">
        {gameConfig
          ? (
            <>
              <div className="game-main">
                <div className="char-card-container">
                  {isDuel && (
                    <>
                      <CharacterCard character={catalog.characters[gameConfig.players[0].characterId]} />
                      <span className="vs-badge">VS</span>
                      <CharacterCard character={catalog.characters[gameConfig.players[1].characterId]} />
                    </>
                  )}

                  {isTeamMode && (
                    <>
                      <div className="team-cards">
                        {teamOnePlayers.map((player) => (
                          <CharacterCard
                            key={player.characterId}
                            character={catalog.characters[player.characterId]}
                          />
                        ))}
                      </div>
                      <span className="vs-badge">VS</span>
                      <div className="team-cards">
                        {teamTwoPlayers.map((player) => (
                          <CharacterCard
                            key={player.characterId}
                            character={catalog.characters[player.characterId]}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {!isDuel && !isTeamMode && gameConfig.players
                    .map((player) => (
                      <CharacterCard
                        key={player.characterId}
                        character={catalog.characters[player.characterId]}
                      />
                    ))}
                </div>
              </div>
              {gameVillain && <VillainMatchup villain={gameVillain} minions={gameMinions} />}
              <div className="board-card">
                <img src={gameBoard?.image} alt={`game board: ${gameBoard?.name}`} />
                <div className="board-card-info">
                  <h5>{catalog.sets[gameBoard?.setId]?.name}</h5>
                  <h4>{gameBoard?.name}</h4>
                </div>
              </div>
            </>
          )
          : null}
      </div>
    </div>

  );
}
