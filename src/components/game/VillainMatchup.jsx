const MINION_COLORS = ['#e0263e', '#3b82c4', '#8fc93a', '#2fbfa3', '#c9469f', '#e0a626'];

export default function VillainMatchup({ villain, minions }) {
  if (!villain) return null;

  const half = Math.ceil(minions.length / 2);
  const leftMinions = minions.map((minion, i) => ({ minion, i })).slice(0, half);
  const rightMinions = minions.map((minion, i) => ({ minion, i })).slice(half);

  const renderMinion = ({ minion, i }) => (
    <div
      key={minion.id}
      className="minion-hex"
      style={{ '--minion-color': MINION_COLORS[i % MINION_COLORS.length] }}
    >
      <div className="hex-inner" style={{ backgroundImage: `url(${minion.image})` }}>
        <span className="hex-name">{minion.name}</span>
      </div>
    </div>
  );

  return (
    <div className="matchup">
      <div className="matchup-divider">
        <span className="divider-line" />
        <span className="vs-badge">VS</span>
        <span className="divider-line" />
      </div>

      <div className="villain-cluster">
        <div className="minion-col">
          {leftMinions.map(renderMinion)}
        </div>

        <div className="villain-hex">
          <div className="hex-inner" style={{ backgroundImage: `url(${villain.image})` }}>
            <span className="hex-name">{villain.name}</span>
          </div>
        </div>

        <div className="minion-col">
          {rightMinions.map(renderMinion)}
        </div>
      </div>
    </div>
  );
}
