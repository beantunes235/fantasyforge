import { InsertWorld, InsertCreature, InsertStory } from "@shared/schema";
import { storage } from "./storage";

// Sample world names
const worldNames = [
  "Eldoria", "Mystara", "Arcadia", "Avaloria", "Celestria",
  "Mythaven", "Dragongate", "Sylvanthor", "Faeloria", "Stormhold"
];

// Sample creature types
const creatureTypes = [
  "Dragon", "Griffin", "Phoenix", "Unicorn", "Manticore",
  "Kraken", "Chimera", "Wyvern", "Basilisk", "Hydra"
];

// Sample world types
const worldTypes = [
  "celestial", "medieval", "elemental", "mythical", "enchanted",
  "ancient", "chaotic", "primal", "arcane", "mystic"
];

// Sample magic systems
const magicSystems = [
  "arcane", "elemental", "divine", "wild", "blood",
  "rune", "astral", "crystal", "shadow", "nature"
];

// Random helper function
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Mock world generation
export async function mockGenerateWorld(
  description: string, 
  type: string,
  magicSystem: string
): Promise<InsertWorld> {
  // Use provided params or generate random ones if they're empty
  const worldType = type.trim() || getRandomItem(worldTypes);
  const worldMagic = magicSystem.trim() || getRandomItem(magicSystems);
  
  // Generate a random world name if the description doesn't suggest one
  const worldName = description.length > 20 
    ? description.split(' ').slice(0, 2).join('') 
    : getRandomItem(worldNames);
  
  // Get a random landscape image
  const imageUrl = storage.getRandomImage('landscape');
  
  return {
    name: worldName,
    description: description || `A magical realm of wonder and adventure, where the ${worldType} forces shape reality and ${worldMagic} magic flows freely.`,
    type: worldType,
    magicSystem: worldMagic,
    geography: `A varied landscape with towering mountains, lush forests, and vast plains. The ${worldType} nature of this world creates unique geographical formations not seen elsewhere.`,
    magic: `The ${worldMagic} magic system is predominant here, allowing practitioners to manipulate the fundamental forces of the world. Magic users are ${worldType === 'ancient' ? 'revered elders' : 'respected adventurers'} in society.`,
    inhabitants: `Various intelligent species populate this realm, from humans and elves to more exotic creatures. The inhabitants have adapted to the ${worldType} environment and many have innate ${worldMagic} abilities.`,
    history: `The world has a rich history spanning thousands of years, with great empires rising and falling. The discovery of ${worldMagic} magic changed the course of civilization dramatically.`,
    region: `The central region known as the ${worldName} Heartlands`,
    regions: [`Northern ${worldName}`, `${worldName} Forests`, `Southern ${worldName} Plains`, `${worldName} Mountains`],
    imageUrl
  };
}

// Mock creature generation
export async function mockGenerateCreature(
  type: string,
  description: string,
  powerLevel: number,
  intelligence: number,
  worldId: number
): Promise<InsertCreature> {
  // Use provided type or generate random one
  const creatureType = type.trim() || getRandomItem(creatureTypes);
  
  // Get creature name based on type or description
  const creatureName = description.length > 10 
    ? description.split(' ').slice(0, 2).join(' ') 
    : `${getRandomItem(['Ancient', 'Mystical', 'Legendary', 'Fabled', 'Majestic'])} ${creatureType}`;
  
  // Power-related adjectives based on powerLevel
  const powerAdjectives = [
    "weak", "fragile", "modest", "capable", "strong",
    "powerful", "formidable", "mighty", "incredible", "godlike"
  ];
  
  // Intelligence-related adjectives based on intelligence
  const intelligenceAdjectives = [
    "mindless", "instinctual", "simple", "basic", "average",
    "clever", "intelligent", "brilliant", "genius", "transcendent"
  ];
  
  // Get a random creature image
  const imageUrl = storage.getRandomImage('creature');
  
  // Generate random abilities based on power and intelligence
  const abilityCount = Math.max(2, Math.floor((powerLevel + intelligence) / 4));
  const potentialAbilities = [
    "Fire breath", "Lightning strike", "Invisibility", "Flight", 
    "Water breathing", "Telepathy", "Healing", "Venom", "Stone skin",
    "Night vision", "Shapeshifting", "Teleportation", "Mind control",
    "Illusion casting", "Ice manipulation", "Earth bending"
  ];
  
  const abilities: string[] = [];
  for (let i = 0; i < abilityCount; i++) {
    const ability = getRandomItem(potentialAbilities);
    if (!abilities.includes(ability)) {
      abilities.push(ability);
    }
  }
  
  // Random stats based on the provided powerLevel and intelligence
  const speed = Math.max(1, Math.min(10, Math.floor(Math.random() * 5) + powerLevel / 2));
  const magic = Math.max(1, Math.min(10, Math.floor(Math.random() * 5) + powerLevel / 2));
  
  return {
    name: creatureName,
    description: description || `A ${powerAdjectives[powerLevel-1]} and ${intelligenceAdjectives[intelligence-1]} creature that inhabits remote regions. ${creatureType}s are known for their ${abilities.join(' and ')} abilities.`,
    type: creatureType,
    powerLevel,
    intelligence,
    speed,
    magic,
    abilities,
    imageUrl,
    worldId
  };
}

// Mock story generation
export async function mockGenerateStory(
  theme: string,
  protagonist: string,
  setting: string,
  plotElements: string[],
  worldId?: number,
  creatureIds?: number[]
): Promise<InsertStory> {
  // Get world details if available
  let worldName = "the realm";
  let worldContext = "";
  
  if (worldId) {
    const world = await storage.getWorld(worldId);
    if (world) {
      worldName = world.name;
      worldContext = `in the world of ${world.name}`;
    }
  }
  
  // Get creature details if available
  let creaturesContext = "";
  let creatureNames: string[] = [];
  
  if (creatureIds && creatureIds.length > 0) {
    const creatures = await Promise.all(creatureIds.map(id => storage.getCreature(id)));
    const validCreatures = creatures.filter(c => c !== undefined);
    
    if (validCreatures.length > 0) {
      creatureNames = validCreatures.map(c => c!.name);
      creaturesContext = ` accompanied by ${creatureNames.join(' and ')}`;
    }
  }
  
  // Story templates
  const beginnings = [
    `In the ancient days of ${worldName}, when magic still flowed freely through the land,`,
    `Beyond the misty mountains of ${worldName}, hidden from prying eyes,`,
    `When darkness fell upon ${worldName}, threatening to consume all in its path,`,
    `During the great celebration of the summer solstice in ${worldName},`,
    `After a thousand years of peace in ${worldName}, the ancient prophecy began to unfold,`
  ];
  
  const middles = [
    `our hero embarked on a quest that would test their courage and determination.`,
    `a mysterious artifact was discovered that would change everything.`,
    `an unlikely alliance formed between ancient enemies.`,
    `the forgotten magic began to awaken once more.`,
    `the balance between order and chaos started to shift dramatically.`
  ];
  
  const endings = [
    `Through perseverance and sacrifice, harmony was finally restored to the land.`,
    `Though the cost was great, a new age of prosperity dawned for all.`,
    `Victory was achieved, but the hero was forever changed by the journey.`,
    `The quest succeeded beyond all expectations, revealing greater mysteries still to be solved.`,
    `Peace returned to the realm, though whispers spoke of challenges yet to come.`
  ];
  
  // Generate title
  const titlePrefixes = ["The Legend of", "Quest for", "Tale of", "Chronicles of", "Saga of"];
  const titleSuffixes = ["Destiny", "the Ancient Power", "the Lost Kingdom", "Redemption", "Awakening"];
  
  let title = "";
  if (protagonist && theme) {
    title = `${getRandomItem(titlePrefixes)} ${protagonist}: ${theme}`;
  } else if (protagonist) {
    title = `${getRandomItem(titlePrefixes)} ${protagonist}`;
  } else if (theme) {
    title = `${theme}: A Tale of ${worldName}`;
  } else {
    title = `${getRandomItem(titlePrefixes)} ${getRandomItem(titleSuffixes)}`;
  }
  
  // Build story content
  const beginning = getRandomItem(beginnings);
  const middle = getRandomItem(middles);
  const ending = getRandomItem(endings);
  
  // Incorporate plot elements
  let plotElementsText = "";
  if (plotElements && plotElements.length > 0) {
    plotElementsText = `\n\nThe journey involved ${plotElements.join(', ')}, testing our hero at every turn.`;
  }
  
  // Protagonist and setting
  const heroText = protagonist ? protagonist : "a brave hero";
  const settingText = setting ? `in ${setting}` : `in the lands of ${worldName}`;
  
  // Construct the full story
  const content = `${beginning} ${heroText}${creaturesContext} ${settingText} ${middle}
  
As the tale unfolds, ${heroText} discovers that the fate of ${worldName} hangs in the balance. Ancient powers stir, and forgotten truths come to light. With each challenge overcome, our protagonist grows stronger, wiser, and more determined.${plotElementsText}

The path is fraught with danger and unexpected allies. Mountains are climbed, rivers crossed, and battles fought. Through darkness and light, the journey continues, ever forward toward destiny.

${ending}`;

  return {
    title,
    content,
    theme: theme || "Adventure",
    protagonist: protagonist || "Unknown Hero",
    setting: setting || worldName,
    plotElements: plotElements || [],
    worldId: worldId || 0,
    creatureIds: creatureIds || []
  };
}