export const boards = {
  // Battle of Legends Vol. 1
  marmoreal: {
    id: 'marmoreal',
    setId: 'battle-of-legends-vol-1',
    name: 'Marmoreal',
    maxPlayers: 4,
    image: '/images/boards/marmoreal.webp',
    description:
      'A ruined marble city with chokepoints and elevation that rewards careful positioning and controlled engagements.',
    tags: ['chokepoints', 'elevation'],
  },
  sarpedon: {
    id: 'sarpedon',
    setId: 'battle-of-legends-vol-1',
    name: 'Sarpedon',
    maxPlayers: 4,
    image: '/images/boards/sarpedon.webp',
    description:
      'A more open battleground that encourages fast movement, quick clashes, and aggressive tempo play.',
    tags: ['open', 'tempo'],
  },

  // Robin Hood vs Bigfoot
  'sherwood-forest': {
    id: 'sherwood-forest',
    setId: 'robin-hood-vs-bigfoot',
    name: 'Sherwood Forest',
    maxPlayers: 2,
    image: '/images/boards/sherwood-forest.webp',
    description:
      'A dense woodland map with tight paths and clever angles, rewarding tactical movement and ranged threats.',
    tags: ['tight', 'tactical'],
  },
  yukon: {
    id: 'yukon',
    setId: 'robin-hood-vs-bigfoot',
    name: 'Yukon',
    maxPlayers: 2,
    image: '/images/boards/yukon.webp',
    description:
      'A rugged wilderness board with direct lanes and brawl-friendly spacing for aggressive play.',
    tags: ['open', 'brawl'],
  },

  // InGen vs Raptors
  'raptor-paddock': {
    id: 'raptor-paddock',
    setId: 'ingen-vs-raptors',
    name: 'Raptor Paddock',
    maxPlayers: 2,
    image: '/images/boards/raptor-paddock.webp',
    description:
      'A tense, hunt-focused battleground designed for tight duels and careful positioning.',
    tags: ['duel', 'tension'],
  },

  // Cobble & Fog
  soho: {
    id: 'soho',
    setId: 'cobble-and-fog',
    name: 'SoHo',
    maxPlayers: 4,
    image: '/images/boards/soho.webp',
    description:
      'Foggy city streets with ambush-friendly routes and corners that reward clever pathing and surprise strikes.',
    tags: ['ambush', 'urban'],
  },
  'baskerville-manor': {
    id: 'baskerville-manor',
    setId: 'cobble-and-fog',
    name: 'Baskerville Manor',
    maxPlayers: 4,
    image: '/images/boards/baskerville-manor.webp',
    description:
      'A sprawling estate with long sightlines and strong positions, encouraging patient, tactical play.',
    tags: ['sightlines', 'tactical'],
  },

  // Buffy
  'sunnydale-high': {
    id: 'sunnydale-high',
    setId: 'buffy-the-vampire-slayer',
    name: 'Sunnydale High',
    maxPlayers: 4,
    image: '/images/boards/sunnydale-high.webp',
    description:
      'Hallways and courtyards create clean lanes and chokepoints, rewarding positioning and coordinated movement.',
    tags: ['chokepoints', 'lanes'],
  },
  'the-bronze': {
    id: 'the-bronze',
    setId: 'buffy-the-vampire-slayer',
    name: 'The Bronze',
    maxPlayers: 4,
    image: '/images/boards/the-bronze.webp',
    description:
      'A tight urban venue where space is limited and scrappy fights break out quickly.',
    tags: ['tight', 'brawl'],
  },

  // Little Red vs Beowulf
  heorot: {
    id: 'heorot',
    setId: 'little-red-vs-beowulf',
    name: 'Heorot',
    maxPlayers: 2,
    image: '/images/boards/heorot.webp',
    description:
      'A compact battlefield that forces frequent clashes and rewards efficient positioning.',
    tags: ['duel', 'tight'],
  },

  // Battle of Legends Vol. 2
  'hanging-gardens': {
    id: 'hanging-gardens',
    setId: 'battle-of-legends-vol-2',
    name: 'Hanging Gardens',
    maxPlayers: 4,
    image: '/images/boards/hanging-gardens.webp',
    description:
      'A lush arena that rewards mobility, timing, and controlling key spaces.',
    tags: ['mobility', 'control'],
  },

  // Marvel: Hell’s Kitchen
  'hells-kitchen': {
    id: 'hells-kitchen',
    setId: 'hells-kitchen',
    name: "Hell's Kitchen",
    maxPlayers: 4,
    image: '/images/boards/hells-kitchen.webp',
    description:
      'A gritty urban battleground designed for intense skirmishes and constant pressure.',
    tags: ['urban', 'brawl'],
  },

  // Marvel: Redemption Row
  'the-raft': {
    id: 'the-raft',
    setId: 'redemption-row',
    name: 'The Raft',
    maxPlayers: 4,
    image: '/images/boards/the-raft.webp',
    description:
      'A high-security prison arena that encourages direct conflict and punishes poor positioning.',
    tags: ['duel', 'tempo'],
  },

  // Jurassic Park: Sattler vs T. Rex
  't-rex-paddock': {
    id: 't-rex-paddock',
    setId: 'dr-sattler-vs-t-rex',
    name: 'T. Rex Paddock',
    maxPlayers: 2,
    image: '/images/boards/t-rex-paddock.webp',
    description:
      'A contained enclosure built for tense duels—small decisions can swing the entire match.',
    tags: ['duel', 'tight'],
  },

  // Houdini vs The Genie
  'king-solomons-mine': {
    id: 'king-solomons-mine',
    setId: 'houdini-vs-the-genie',
    name: "King Solomon's Mine",
    maxPlayers: 2,
    image: '/images/boards/king-solomons-mine.webp',
    description:
      'A dramatic battleground that rewards smart movement and well-timed engagements.',
    tags: ['tactical', 'duel'],
  },

  // Marvel: Teen Spirit
  'navy-pier': {
    id: 'navy-pier',
    setId: 'teen-spirit',
    name: 'Navy Pier',
    maxPlayers: 4,
    image: '/images/boards/navy-pier.webp',
    description:
      'An open waterfront arena that rewards mobility and smart spacing.',
    tags: ['open', 'mobility'],
  },

  // Marvel: For King and Country
  helicarrier: {
    id: 'helicarrier',
    setId: 'for-king-and-country',
    name: 'Helicarrier',
    maxPlayers: 4,
    image: '/images/boards/helicarrier.webp',
    description:
      'A high-stakes battlefield with clear lanes that rewards decisive positioning and tactical pressure.',
    tags: ['lanes', 'tactical'],
  },

  // Marvel: Brains and Brawn
  'sanctum-sanctorum': {
    id: 'sanctum-sanctorum',
    setId: 'brains-and-brawn',
    name: 'Sanctum Sanctorum',
    maxPlayers: 4,
    image: '/images/boards/sanctum-sanctorum.webp',
    description:
      'A mystical battleground that encourages smart positioning and creative tactical play.',
    tags: ['tactical', 'control'],
  },

  // Adventures: Tales to Amaze
  mcminnville: {
    id: 'mcminnville',
    setId: 'tales-to-amaze',
    name: 'McMinnville',
    maxPlayers: 5,
    image: '/images/boards/mcminnville.webp',
    description:
      'A cooperative battleground with open spaces designed around scenario play and shared objectives.',
    tags: ['co-op', 'scenario'],
  },
  'point-pleasant': {
    id: 'point-pleasant',
    setId: 'tales-to-amaze',
    name: 'Point Pleasant',
    maxPlayers: 5,
    image: '/images/boards/point-pleasant.webp',
    description:
      'A mysterious riverside town board built for cooperative encounters and unpredictable threats.',
    tags: ['co-op', 'scenario'],
  },

  // Sun’s Origin
  'azuchi-castle': {
    id: 'azuchi-castle',
    setId: 'suns-origin',
    name: 'Azuchi Castle',
    maxPlayers: 2,
    image: '/images/boards/azuchi-castle.webp',
    description:
      'A fortified stronghold with clear lanes and defensive positions—perfect for precise duels.',
    tags: ['duel', 'tactical'],
  },

  // Slings & Arrows
  'globe-theatre': {
    id: 'globe-theatre',
    setId: 'slings-and-arrows',
    name: 'Globe Theatre',
    maxPlayers: 4,
    image: '/images/boards/globe-theatre.webp',
    description:
      'A theatrical arena where positioning and timing feel like staging a performance—ideal for clever, swingy play.',
    tags: ['thematic', 'tactical'],
  },

  // Witcher
  'streets-of-novigrad': {
    id: 'streets-of-novigrad',
    setId: 'realms-fall',
    name: 'Streets of Novigrad',
    maxPlayers: 4,
    image: '/images/boards/streets-of-novigrad.webp',
    description:
      'A bustling city battlefield with opportunities for ambushes, pressure, and tactical maneuvering.',
    tags: ['urban', 'ambush'],
  },
  naglfar: {
    id: 'naglfar',
    setId: 'realms-fall',
    name: 'Naglfar',
    maxPlayers: 4,
    image: '/images/boards/naglfar.webp',
    description:
      'A grim, high-stakes battleground that rewards decisive movement and aggressive engagements.',
    tags: ['aggressive', 'tempo'],
  },
  'kaer-morhen': {
    id: 'kaer-morhen',
    setId: 'steel-and-silver',
    name: 'Kaer Morhen',
    maxPlayers: 4,
    image: '/images/boards/kaer-mohren.webp',
    description:
      'A fortress map built for disciplined positioning—small advantages compound into big swings.',
    tags: ['tactical', 'defensive'],
  },
  'fayrlund-forest': {
    id: 'fayrlund-forest',
    setId: 'steel-and-silver',
    name: 'Fayrlund Forest',
    maxPlayers: 4,
    image: '/images/boards/fayrlund-forest.webp',
    description:
      'A dangerous woodland battleground that rewards mobility, pressure, and hunting down openings.',
    tags: ['wilderness', 'mobility'],
  },
};
