import catalog from '@/catalog';
import CharacterCard from '@/components/game/CharacterCard';
import GameCard from '@/components/game/GameCard';
import PlayerCard from '@/components/game/PlayerCard';
import Nav from '@/components/nav/Nav';
import { generateGameConfig } from '@/game-logic/unmatched';
import { clearConfig, loadConfig, saveConfig } from '@/storage/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './game.scss';

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

  // ROUTER
  const navigate = useNavigate();

  // EVENT HANDLERS
  const startNewGame = () => {
    clearConfig('gameConfig');
    navigate('/unmatched');
  };

  const rerollGame = () => {
    if (!isValidGameConfig(gameConfig)) {
      clearConfig('gameConfig');
      navigate('/unmatched');
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
                  {gameConfig.players
                    .map((player) => (
                      <CharacterCard
                        key={player.characterId}
                        character={catalog.characters[player.characterId]}
                      />
                    ))}
                </div>
              </div>
              <img src={gameBoard?.image} alt={`game board: ${gameBoard?.name}`} />
            </>
          )
          : null}
      </div>
    </div>

  );
}
