import { sets } from '@/catalog';

export default function CharacterCard({ character }) {
  return (
    <div
      className="character-card"
      style={{ backgroundImage: `url(${character.image})` }}
    >
      <div className="char-card-info">
        <h5>{sets[character.setId].name}</h5>
        <h4>{character.name}</h4>
      </div>
    </div>
  );
}
