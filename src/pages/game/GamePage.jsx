import catalog from '@/catalog';
import CharacterCard from '@/components/game/CharacterCard';
import GameCard from '@/components/game/GameCard';
import PlayerCard from '@/components/game/PlayerCard';
import VillainMatchup from '@/components/game/VillainMatchup';
import Nav from '@/components/nav/Nav';
import { generateGameConfig } from '@/game-logic/unmatched';
import { clearConfig, loadConfig, saveConfig } from '@/storage/config';
import {
  Fragment, useEffect, useState,
} from 'react';
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
  const isFfa = gameConfig?.modeId === 'ffa';
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
                    <div className="matchup-row duel-row">
                      <CharacterCard
                        character={catalog.characters[gameConfig.players[0].characterId]}
                        playerName={gameConfig.players[0].name}
                        startingSpace={gameConfig.players[0].turnOrder}
                      />
                      <span className="vs-badge">VS</span>
                      <CharacterCard
                        character={catalog.characters[gameConfig.players[1].characterId]}
                        playerName={gameConfig.players[1].name}
                        startingSpace={gameConfig.players[1].turnOrder}
                      />
                    </div>
                  )}

                  {isTeamMode && (
                    <div className="matchup-row">
                      <div className="team-cards">
                        {teamOnePlayers.map((player) => (
                          <CharacterCard
                            key={player.characterId}
                            character={catalog.characters[player.characterId]}
                            playerName={player.name}
                            startingSpace={player.turnOrder}
                          />
                        ))}
                      </div>
                      <span className="vs-badge">VS</span>
                      <div className="team-cards">
                        {teamTwoPlayers.map((player) => (
                          <CharacterCard
                            key={player.characterId}
                            character={catalog.characters[player.characterId]}
                            playerName={player.name}
                            startingSpace={player.turnOrder}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {isFfa && (
                    <>
                      {/* mobile: 2-column grid, VS spans both columns as a central hub */}
                      <div className="ffa-grid">
                        {gameConfig.players.map((player, i) => {
                          const isTrailingOdd = gameConfig.players.length % 2 !== 0
                            && i === gameConfig.players.length - 1;

                          return (
                            <Fragment key={player.characterId}>
                              {i === 2 && <span className="vs-badge ffa-vs-badge">VS</span>}
                              <CharacterCard
                                character={catalog.characters[player.characterId]}
                                playerName={player.name}
                                startingSpace={player.turnOrder}
                                className={isTrailingOdd ? 'ffa-card-centered' : undefined}
                              />
                            </Fragment>
                          );
                        })}
                      </div>

                      {/* desktop: single line, a VS chip between every card */}
                      <div className="ffa-row">
                        {gameConfig.players.map((player, i) => (
                          <Fragment key={player.characterId}>
                            {i > 0 && <span className="vs-chip">VS</span>}
                            <CharacterCard
                              character={catalog.characters[player.characterId]}
                              playerName={player.name}
                              startingSpace={player.turnOrder}
                            />
                          </Fragment>
                        ))}
                      </div>
                    </>
                  )}

                  {!isDuel && !isTeamMode && !isFfa && gameConfig.players
                    .map((player) => (
                      <CharacterCard
                        key={player.characterId}
                        character={catalog.characters[player.characterId]}
                        playerName={player.name}
                        startingSpace={player.turnOrder}
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
