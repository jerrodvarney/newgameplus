import catalog from '@/catalog';

const MODE_DEFS = {
  '1v1': { name: '1 vs 1', allowedPlayerCounts: [2] },
  '2v2': { name: '2 vs 2', allowedPlayerCounts: [4] },
  ffa: { name: 'Free for All', allowedPlayerCounts: [3, 4] },
  tales: { name: 'Tales to Amaze', allowedPlayerCounts: [1, 2, 3, 4] },
};

export const getOwnedChars = (ownedSetIds = []) => ownedSetIds
  .flatMap((id) => catalog.sets[id]?.characterIds ?? []);

const getValidChars = (ownedSetIds = [], bannedCharacterIds = {}) => getOwnedChars(ownedSetIds)
  .filter((id) => !bannedCharacterIds[id])
  .map((id) => catalog.characters[id]);

export const getOwnedBoards = (ownedSetIds = []) => ownedSetIds
  .flatMap((id) => catalog.sets[id]?.boardIds ?? []);

const getValidBoards = (ownedSetIds = [], bannedBoardIds = {}) => getOwnedBoards(ownedSetIds)
  .filter((id) => !bannedBoardIds[id])
  .map((id) => catalog.boards[id]);

export const pruneBans = (prevBans, ownedIds) => {
  const ownedSet = new Set(ownedIds);
  const pruned = {};

  Object.keys(prevBans)
    .forEach((id) => {
      if (ownedSet.has(id)) pruned[id] = true;
    });

  return pruned;
};

const getMaxPlayersFromBoards = (validBoards = []) => {
  if (!validBoards.length) return 0;
  return Math.max(...validBoards.map((b) => b.maxPlayers ?? 0));
};

const pickRandom = (items = []) => items[Math.floor(Math.random() * items.length)];

const getRandomOrder = (numPlayers) => Array
  .from({ length: numPlayers }, (_, i) => i + 1)
  .sort(() => Math.random() - 0.5);

const getRandomBoardId = ({ ownedSetIds, bannedBoardIds }, numPlayers, modeId) => {
  let validBoards = getValidBoards(ownedSetIds, bannedBoardIds)
    .filter((board) => (board.maxPlayers ?? 0) >= numPlayers);

  if (numPlayers === 5 || modeId === 'tales') {
    validBoards = validBoards.filter((board) => board.setId === 'tales-to-amaze');
  }

  return pickRandom(validBoards)?.id ?? null;
};

const assignCharacters = ({ ownedSetIds, bannedCharacterIds }, playerNames, numPlayers) => {
  const validCharacters = getValidChars(ownedSetIds, bannedCharacterIds);

  if (validCharacters.length < numPlayers) return null;

  const shuffled = [...validCharacters].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, numPlayers);

  return Array.from({ length: numPlayers }, (_, i) => ({
    name: playerNames?.[i]?.trim() || `Player ${i + 1}`,
    characterId: chosen[i].id,
    team: null,
  }));
};

const assignTurnOrder = (players) => {
  const order = getRandomOrder(players.length);

  return players.map((player, i) => ({
    ...player,
    turnOrder: order[i],
  }))
    .sort((a, b) => a.turnOrder - b.turnOrder);
};

const assign2v2Team = (players) => players
  .map((player) => ({
    ...player,
    team: player.turnOrder % 2 === 1 ? 1 : 2,
  }));

const buildPlayers = (userConfig, playerNames, nPlayers, modeId) => {
  let players = assignCharacters(userConfig, playerNames, nPlayers);
  if (!players) return null;

  players = assignTurnOrder(players);
  if (modeId === '2v2') players = assign2v2Team(players);

  return players;
};

const checkTalesModeAvailable = (validBoards) => validBoards
  .some(({ setId }) => setId === 'tales-to-amaze');

const getModeDisableReason = (
  modeId,
  allowedPlayerCounts,
  maxPlayersFromBoards,
  validCharacterCount,
  talesAvailable,
) => {
  const reasons = [];
  const minRequiredPlayers = Math.min(...allowedPlayerCounts);

  if (modeId === 'tales' && !talesAvailable) {
    reasons.push('Requires at least one board from the Tales to Amaze set.');
  }

  if (validCharacterCount < minRequiredPlayers) {
    reasons.push(`Requires minimum of ${minRequiredPlayers} characters. You have ${validCharacterCount}.`);
  }

  if (maxPlayersFromBoards < minRequiredPlayers && modeId !== 'tales') {
    reasons.push(`No available board supports ${minRequiredPlayers} players.`);
  }

  if (!reasons.length) return null;
  return reasons.join(' ');
};

const checkModesEnabled = (maxPlayersFromBoards, validCharacterCount, talesAvailable) => {
  const maxPlayers = Math.min(maxPlayersFromBoards, validCharacterCount);

  return Object
    .entries(MODE_DEFS)
    .reduce((acc, [modeId, def]) => {
      const { allowedPlayerCounts } = def;

      const enabled = allowedPlayerCounts.some((count) => {
        if (count > maxPlayers) return false;
        if (modeId === 'tales' && !talesAvailable) return false;
        return true;
      });

      const reason = enabled
        ? null
        : getModeDisableReason(
          modeId,
          allowedPlayerCounts,
          maxPlayersFromBoards,
          validCharacterCount,
          talesAvailable,
        );

      const { id, name } = def;

      acc[modeId] = {
        id,
        name,
        enabled,
        allowedPlayerCounts,
        reason,
      };

      return acc;
    }, {});
};

export const getCapabilities = ({ ownedSetIds, bannedBoardIds, bannedCharacterIds }) => {
  const validBoards = getValidBoards(ownedSetIds, bannedBoardIds);
  const validCharacterCount = getValidChars(ownedSetIds, bannedCharacterIds).length;

  const talesAvailable = checkTalesModeAvailable(validBoards);

  const maxPlayersFromBoards = getMaxPlayersFromBoards(validBoards);
  const maxPlayers = Math.min(maxPlayersFromBoards, validCharacterCount);

  const modes = checkModesEnabled(maxPlayersFromBoards, validCharacterCount, talesAvailable);

  const capabilities = {
    gameId: 'unmatched',
    talesAvailable,
    maxPlayers,
    modes,
  };

  return capabilities;
};

export const generateGameConfig = ({
  userConfig, modeId, numPlayers, playerNames,
}) => {
  const nPlayers = Math.max(1, Number(numPlayers) || 0);

  const boardId = getRandomBoardId(userConfig, nPlayers, modeId);
  if (!boardId) return { error: { code: 'NO_VALID_BOARDS' } };

  const players = buildPlayers(userConfig, playerNames, nPlayers, modeId);
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

// export const generateTalesConfig = () => {
// // will return a gameConfig object specifically for tales to amaze mode
// };
