import { sets } from '@/catalog';

export default function CharacterCard({ character, playerName, startingSpace }) {
  return (
    <div
      className="character-card"
      style={{ backgroundImage: `url(${character.image})` }}
    >
      {playerName && <span className="char-card-player">{playerName}</span>}
      {startingSpace && <span className="char-card-space">{`Space ${startingSpace}`}</span>}
      <div className="char-card-info">
        <h5>{sets[character.setId].name}</h5>
        <h4>{character.name}</h4>
      </div>
    </div>
  );
}
