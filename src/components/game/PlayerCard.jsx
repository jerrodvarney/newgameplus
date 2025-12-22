export default function PlayerCard({ player, character }) {
  return (
    <div className="player-card">
      <h3>{player.name}</h3>
      <p>{`Character: ${character.name}`}</p>
      <p>{`Starting Space: ${player.startingSpace}`}</p>
    </div>
  );
}
