import { useState } from 'react';

export default function SetSelector({ setInfo, updateSelected }) {
  // STATE
  const [isSelected, toggleSelected] = useState(false);

  // EVENT HANDLERS
  const toggleSet = () => {
    toggleSelected(!isSelected);

    updateSelected();
  };

  return (
    <button
      type="button"
      className="set-card"
      onClick={toggleSet}
    >
      <div className={`img-wrapper ${isSelected && 'selected'}`}>
        <img src={setInfo.image} alt={`Art for ${setInfo.name}`} />
      </div>
    </button>
  );
}
