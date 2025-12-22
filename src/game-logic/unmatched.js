import catalog from '@/catalog';

// TO DO
// add logic for handling tales to amaze game Config
// add user preference option to character, board, and team Config functions
// (will be a preference object on each player object from config)

export const getOwnedChars = (ownedSetIds = []) => ownedSetIds
  .flatMap((id) => catalog.sets[id]?.characterIds ?? []);

export const getOwnedBoards = (ownedSetIds = []) => ownedSetIds
  .flatMap((id) => catalog.sets[id]?.boardIds ?? []);

const pickRandom = (items) => {
  if (!items?.length) return null;
  return items[Math.floor(Math.random() * items.length)];
};

const getRandomOrder = (numPlayers) => Array.from({ length: numPlayers }, (_, i) => i + 1)
  .sort(() => Math.random() - 0.5);

const getRandomBoardId = (userConfig, numPlayers, modeId) => {
  const ownedBoards = getOwnedBoards(userConfig.ownedSetIds);
  const banned = userConfig.bannedBoardIds ?? [];

  let validBoards = ownedBoards
    .filter((id) => !banned.includes(id))
    .filter((id) => (catalog.boards[id]?.maxPlayers ?? 0) >= numPlayers);

  if (numPlayers === 5 || modeId === 'tales') {
    validBoards = validBoards.filter((id) => catalog.boards[id]?.setId === 'tales-to-amaze');
  }

  return pickRandom(validBoards);
};

const assignCharacters = (userConfig, playerNames, numPlayers) => {
  const ownedCharacters = getOwnedChars(userConfig.ownedSetIds);
  const banned = userConfig.bannedCharacterIds ?? [];
  const validCharacters = ownedCharacters.filter((id) => !banned.includes(id));

  if (validCharacters.length < numPlayers) return null;

  const shuffled = [...validCharacters].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, numPlayers);

  return Array.from({ length: numPlayers }, (_, i) => ({
    name: playerNames?.[i]?.trim() || `Player ${i + 1}`,
    characterId: chosen[i],
    team: null,
  }));
};

const assignStartingSpace = (players, maxSpaces) => {
  const spaces = getRandomOrder(maxSpaces).slice(0, players.length);

  const assignedPlayers = players.map((player, i) => ({
    ...player,
    startingSpace: spaces[i],
  }));

  return assignedPlayers;
};

const assignTurnOrder = (players) => {
  const order = getRandomOrder(players.length);

  return players.map((player, i) => ({
    ...player,
    turnOrder: order[i],
  }))
    .sort((a, b) => a.turnOrder - b.turnOrder);
};

const assign2v2Team = (players) => players.map((player) => ({
  ...player,
  team: player.turnOrder % 2 === 1 ? 1 : 2,
}));

const buildPlayers = (userConfig, playerNames, nPlayers, modeId, boardId) => {
  let players = assignCharacters(userConfig, playerNames, nPlayers);
  if (!players) return null;

  const maxSpaces = catalog.boards[boardId]?.maxPlayers ?? nPlayers;

  players = assignStartingSpace(players, maxSpaces);
  players = assignTurnOrder(players);
  if (modeId === '2v2') players = assign2v2Team(players);

  return players;
};

const getPlayerCount = (type) => {

};

const getModesAvailable = (userConfig) => {

};

export const getCapabilities = (userConfig) => {
  const capabilities = {
    minPlayers: getPlayerCount('min'),
    maxPlayers: getPlayerCount('max'),
    modes: getModesAvailable(userConfig),
  };

  return capabilities;
};

export const generateGameConfig = ({
  userConfig, modeId, numPlayers, playerNames,
}) => {
  const nPlayers = Math.max(1, Number(numPlayers) || 0);

  const boardId = getRandomBoardId(userConfig, nPlayers, modeId);
  if (!boardId) return { error: { code: 'NO_VALID_BOARDS' } };

  const players = buildPlayers(userConfig, playerNames, nPlayers, modeId, boardId);
  if (!players) return { error: { code: 'NOT_ENOUGH_CHARACTERS' } };

  const gameConfig = {
    gameId: 'unmatched',
    modeId,
    numPlayers: nPlayers,
    boardId,
    players,
  };

  return gameConfig;
};

export const generateTalesConfig = () => {
// will return a gameConfig object specifically for tales to amaze mode
};
