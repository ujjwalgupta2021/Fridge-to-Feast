/**
 * Fridge-to-Feast | Configuration & Constants
 * Hacktoberfest 2026 Week 3: Slow and Steady Challenge
 */

const STORAGE_KEYS = {
  INVENTORY: 'fridge_to_feast_inventory',
  ENERGY_MODE: 'fridge_to_feast_energy_mode',
  MINIMIZE_DISHES: 'fridge_to_feast_minimize_dishes',
  GEMINI_KEY: 'fridge_to_feast_gemini_key',
  GEMINI_MODEL: 'fridge_to_feast_gemini_model',
  GEMINI_API_VERSION: 'fridge_to_feast_gemini_api_version',
  SAVED_RECIPES: 'fridge_to_feast_saved_recipes',
  SOUND_ENABLED: 'fridge_to_feast_sound_enabled',
  THEME: 'fridge_to_feast_theme'
};

const DEFAULT_INVENTORY = [
  "Paneer",
  "Capsicum",
  "Tomatoes",
  "Onions",
  "Basmati Rice",
  "Cumin Seeds"
];

const PANTRY_STAPLES = [
  "Paneer", "Capsicum", "Tomatoes", "Potatoes", 
  "Rice", "Spinach", "Green Peas", "Lentils", 
  "Ginger", "Cilantro", "Cumin", "Turmeric"
];

const ENERGY_MODES = [
  {
    index: 0,
    name: "Microwave Chef (3 mins)",
    tag: "⚡ Microwave Chef (3 mins)",
    timeStr: "3-5 mins",
    emoji: "⚡",
    description: "<strong>Microwave Chef:</strong> Zero chopping or pan-watching. Throw into a heatproof mug or bowl, zap for 3 minutes, and enjoy immediately!",
    cookware: "1 Microwave Mug / Bowl & Spoon",
    timeSaved: "35 mins",
    dishesSaved: "4 Pans"
  },
  {
    index: 1,
    name: "One-Pan Stir-Fry (15 mins)",
    tag: "🍳 One-Pan Stir-Fry (15 mins)",
    timeStr: "15 mins",
    emoji: "🍳",
    description: "<strong>One-Pan Stir-Fry:</strong> Light dicing, medium flame sizzle. Great flavor-to-effort ratio, cooked and served directly from one skillet!",
    cookware: "1 Cast-Iron Skillet & Spatula",
    timeSaved: "25 mins",
    dishesSaved: "3 Pans"
  },
  {
    index: 2,
    name: "Slow Simmer (30 mins)",
    tag: "🍲 Slow Simmer (30 mins)",
    timeStr: "30 mins",
    emoji: "🍲",
    description: "<strong>Slow Simmer:</strong> Low heat, set-and-forget stew or curry. Walk away, relax, or take a sloth nap while the pot does the heavy lifting.",
    cookware: "1 Deep Soup Pot & Wooden Spoon",
    timeSaved: "15 mins",
    dishesSaved: "2 Pans"
  }
];

// Strict Pure Vegetarian Validation Rules
const VEG_EXCEPTIONS = [
  'eggplant', 'aubergine', 'chickpea', 'chickpeas', 'jackfruit', 
  'dragonfruit', 'grapefruit', 'passionfruit', 'breadfruit', 'ladyfinger'
];

const NON_VEG_REGEX = /\b(chicken|beef|pork|mutton|lamb|meat|meats|meatball|meatballs|veal|ham|bacon|sausage|sausages|pepperoni|salami|turkey|duck|prosciutto|pancetta|steak|steaks|ribs|chorizo|hotdog|hot dog|poultry|venison|goat meat|pork belly|fish|fishes|salmon|tuna|cod|tilapia|trout|shrimp|shrimps|prawn|prawns|crab|crabs|lobster|lobsters|seafood|clam|clams|oyster|oysters|mussel|mussels|squid|squids|calamari|octopus|anchovy|anchovies|sardine|sardines|caviar|scallop|scallops|halibut|snapper|catfish|eel|egg|eggs|omelet|omelette|mayo|mayonnaise|gelatin|lard|bone broth|fish sauce|oyster sauce)\b/i;

function isPureVegetarian(name) {
  if (!name || typeof name !== 'string') return false;
  const clean = name.toLowerCase().trim();
  if (clean.length < 2) return false;

  // Check if item contains an allowed veg exception like eggplant or chickpeas
  for (const exc of VEG_EXCEPTIONS) {
    if (clean.includes(exc)) return true;
  }

  // Reject if it matches any non-veg term
  return !NON_VEG_REGEX.test(clean);
}

function detectNonVegKeywords(name) {
  if (!name || typeof name !== 'string') return [];
  const clean = name.toLowerCase().trim();
  for (const exc of VEG_EXCEPTIONS) {
    if (clean.includes(exc)) return [];
  }
  const match = clean.match(NON_VEG_REGEX);
  return match ? [match[0]] : [];
}

function getCanonicalStem(item) {
  if (!item || typeof item !== 'string') return '';
  let clean = item.toLowerCase().trim();
  clean = clean.replace(/\([^)]*\)/g, '').replace(/\b\d+(?:g|ml|cups?|tbsp|tsp)?\b/gi, '').replace(/[()[\]{}]/g, '').trim();
  clean = clean.replace(/\b(cubes?|diced|sliced|chopped|minced|grated|crushed|shredded|boiled|steamed|fried|toasted|cooked|raw|warm|hot|cold|fresh|dried|dry|batons?|puree|leaves?|leaf|seeds?|seed|pieces?|piece|sticks?)\b/gi, '').trim();
  if (/^(?:bell\s+peppers?|shimla\s+mirch|peppers?)$/i.test(clean)) return 'capsicum';
  if (/^(?:tomatoes|tamatar)$/i.test(clean)) return 'tomato';
  if (/^(?:potatoes|aloo)$/i.test(clean)) return 'potato';
  if (/^(?:onions|pyaz)$/i.test(clean)) return 'onion';
  if (/^(?:cottage\s+cheese|paneer\s+cubes?)$/i.test(clean)) return 'paneer';
  if (/^(?:cilantro|dhaniya|coriander\s+leaves?)$/i.test(clean)) return 'coriander';
  if (/^(?:green\s+chilli|green\s+chili|green\s+chillies|mirchi)$/i.test(clean)) return 'green chilli';
  if (/^(?:basmati\s+rice|chawal)$/i.test(clean)) return 'rice';
  if (clean.endsWith('ies')) clean = clean.slice(0, -3) + 'y';
  else if (clean.endsWith('es') && !clean.endsWith('cheese')) clean = clean.slice(0, -2);
  else if (clean.endsWith('s') && !clean.endsWith('ss') && !clean.endsWith('us')) clean = clean.slice(0, -1);
  return clean.trim();
}

// Export to window for browser compatibility
window.STORAGE_KEYS = STORAGE_KEYS;
window.DEFAULT_INVENTORY = DEFAULT_INVENTORY;
window.PANTRY_STAPLES = PANTRY_STAPLES;
window.ENERGY_MODES = ENERGY_MODES;
window.isPureVegetarian = isPureVegetarian;
window.detectNonVegKeywords = detectNonVegKeywords;
window.getCanonicalStem = getCanonicalStem;
