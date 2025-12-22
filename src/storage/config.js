/*

const userConfig = {
  id: 'unmatched',
  ownedSetIds: [],
  bannedBoardIds: [],
  bannedCharacterIds: [],
  hasTales: false
};

// next version of the logic will use this format
// const userConfig = {
//   id: 'unmatched',
//   ownedSetIds: [],
//   banned: {
//     boards: { [boardId]: true }
//     characters: { [characterId, true] },
//   },
//   hasTales: false,
// };

const gameConfig = {
  id: 'unmatched',
  modeId: '1v1',
  numPlayers: 2,
  boardId: 'sarpedon',
  players: [{ name: 'Player 1', characterId: 'alice', team: null, startingSpace: , lock: false }],
  turnOrder: [1, 2],
  lockBoard: false,
};

*/

export const loadConfig = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading Config:', err);
    return false;
  }
};

export const saveConfig = (key, config) => {
  try {
    localStorage.setItem(key, JSON.stringify(config));
    return true;
  } catch (err) {
    console.error('Error saving Config:', err);
    return false;
  }
};

export const clearConfig = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error('Error clearing Config:', err);
    return false;
  }
};
