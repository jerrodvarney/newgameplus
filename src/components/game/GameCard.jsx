import catalog from '@/catalog';
import { getModeName } from '@/game-logic/unmatched';

export default function GameCard({ gameConfig, board }) {
  return (
    <div className="game-info-card">
      <h3>{catalog.name}</h3>
      <div className="game-card-top">
        <div className="game-info">
          <p>{`Game Mode: ${getModeName(gameConfig.modeId)}`}</p>
          <p>{`Board: ${board.name}`}</p>
          {gameConfig.villainId && (
            <p>{`Villain: ${catalog.villains[gameConfig.villainId]?.name}`}</p>
          )}
          {gameConfig.minionIds?.length > 0 && (
            <p>
              {`Minions: ${gameConfig.minionIds
                .map((id) => catalog.minions[id]?.name)
                .join(', ')}`}
            </p>
          )}
        </div>
      </div>
      {gameConfig.modeId === '2v2'
        && (
        <div className="team-parent-container">
          <div className="team-container">
            <h4>Team 1:</h4>
            {gameConfig.players
              .filter((player) => player.team === 1)
              .map((player) => (
                <p key={player.characterId}>{player.name}</p>
              ))}
          </div>
          <div className="team-container">
            <h4>Team 2:</h4>
            {gameConfig.players
              .filter((player) => player.team === 2)
              .map((player) => (
                <p key={player.characterId}>{player.name}</p>
              ))}
          </div>
        </div>
        )}
    </div>
  );
}
