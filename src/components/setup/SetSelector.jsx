export default function SetSelector({ setInfo, updateSelected, selectedSets }) {
  const isSelected = selectedSets.includes(setInfo.id);

  return (
    <button
      type="button"
      className={`set-card ${isSelected ? 'selected' : ''}`}
      onClick={updateSelected}
    >
      <div className="img-wrapper">
        <img src={setInfo.image} alt={`Art for ${setInfo.name}`} />
      </div>
    </button>
  );
}
