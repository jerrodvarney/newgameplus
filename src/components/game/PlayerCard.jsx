export default function PlayerCard({ player, character, i }) {
  return (
    <div className="player-card">
      <h3>{player.name}</h3>
      <p>{`Character: ${character.name}`}</p>
      <p>{`Starting Space: ${i + 1}`}</p>
    </div>
  );
}
