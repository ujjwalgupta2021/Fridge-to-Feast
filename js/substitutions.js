/**
 * Fridge-to-Feast | Lazy Substitutions & Zero-Store Pantry Swaps
 * Pure vegetarian emergency replacements when you're too lazy to visit the grocery store
 */

const LAZY_SUBSTITUTIONS_DB = [
  {
    key: "paneer",
    name: "Paneer / Cottage Cheese",
    category: "Protein",
    swaps: [
      { name: "Tofu", note: "Direct 1:1 protein swap, crisps with a golden crust in 3 minutes", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Boiled Chickpeas", note: "Canned or boiled, hearty nutty bite with zero knife work", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Toasted Bread Cubes", note: "Golden crunchy croutons that soak up spiced gravies", lazyRating: "⭐⭐⭐⭐" },
      { name: "Mushroom Slices", note: "Deep earthy umami and juicy tender bite", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "capsicum",
    aliases: ["bell pepper", "shimla mirch", "peppers"],
    name: "Capsicum / Bell Pepper",
    category: "Vegetables",
    swaps: [
      { name: "Carrot Batons", note: "Sweet, colorful crunch and high beta-carotene", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Cabbage Shreds", note: "Fast wilting, naturally sweet and absorbs pan juices", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Green Beans", note: "Snap with fingers directly into the pan — zero knife wash!", lazyRating: "⭐⭐⭐⭐" },
      { name: "Sweet Corn", note: "Sweet bursts of golden flavor straight from can or freezer", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "tomato",
    aliases: ["tomatoes", "tamatar"],
    name: "Tomato",
    category: "Produce & Tang",
    swaps: [
      { name: "Tomato Ketchup / Puree", note: "1-2 tbsp gives instant umami, savory tang, and silky body", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Lemon Juice + Pinch Sugar", note: "Perfect bright citrus tang with balancing sweetness", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Whisked Curd (Dahi)", note: "Creamy, mild tangy base for rich gravies", lazyRating: "⭐⭐⭐⭐" },
      { name: "Amchur (Dry Mango Powder)", note: "A pinch from your spice box adds instant fruity punch", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "onion",
    aliases: ["onions", "pyaz"],
    name: "Onion",
    category: "Aromatics",
    swaps: [
      { name: "Pinch of Hing (Asafoetida)", note: "Savory garlic-onion umami aroma with zero crying or chopping tears", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Cabbage Shreds", note: "Caramelizes sweet and golden when sizzled in hot oil", lazyRating: "⭐⭐⭐⭐" },
      { name: "Fennel Seeds (Saunf)", note: "Aromatic sweet undertone in warm tadka", lazyRating: "⭐⭐⭐" }
    ]
  },
  {
    key: "garlic",
    aliases: ["lahsun"],
    name: "Garlic",
    category: "Aromatics",
    swaps: [
      { name: "Garlic Powder", note: "Zero sticky peeling! 1/4 tsp equals one fresh clove", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Pinch of Hing (Asafoetida)", note: "Digestive, savory pungency that elevates curries", lazyRating: "⭐⭐⭐⭐" },
      { name: "Ginger Paste", note: "Spicy warm depth to round out aromatics", lazyRating: "⭐⭐⭐" }
    ]
  },
  {
    key: "ginger",
    aliases: ["adrak"],
    name: "Ginger",
    category: "Aromatics",
    swaps: [
      { name: "Dry Ginger Powder (Sonth)", note: "Earthy, concentrated warmth straight from the spice box", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Crushed Black Pepper", note: "Clean, sharp bite to simulate spicy warmth", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "cream",
    aliases: ["malai", "heavy cream"],
    name: "Fresh Cream / Malai",
    category: "Dairy & Fats",
    swaps: [
      { name: "Whisked Curd / Cashew Paste", note: "Velvety smooth consistency without high dairy fats", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Milk + Dollop of Butter", note: "Instant warm emulsion mimicking light cream", lazyRating: "⭐⭐⭐⭐" },
      { name: "Coconut Milk", note: "Naturally vegan, luscious texture & nutty hint", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "coriander",
    aliases: ["cilantro", "dhaniya", "fresh coriander"],
    name: "Fresh Coriander / Cilantro",
    category: "Herbs",
    swaps: [
      { name: "Dried Kasuri Methi", note: "The Indian restaurant secret: crush between dry palms for instant magic", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Dried Mint (Pudina)", note: "Refreshing cooling herbal punch", lazyRating: "⭐⭐⭐⭐" },
      { name: "Mixed Herb Seasoning", note: "Oregano or thyme shaker from last pizza night", lazyRating: "⭐⭐⭐" }
    ]
  },
  {
    key: "cumin",
    aliases: ["jeera", "cumin seeds"],
    name: "Cumin Seeds (Jeera)",
    category: "Spices",
    swaps: [
      { name: "Mustard Seeds (Rai)", note: "Crispy nutty crackle in warm oil or ghee", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Ajwain (Carom Seeds)", note: "Thyme-like fragrance that aids digestion", lazyRating: "⭐⭐⭐⭐" },
      { name: "Garam Masala Powder", note: "Warm all-in-one blend already containing cumin notes", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "rice",
    aliases: ["basmati rice", "chawal", "cooked rice"],
    name: "Rice / Basmati Rice",
    category: "Carbs",
    swaps: [
      { name: "Leftover Torn Roti", note: "Tear rotis into shreds for instant Roti Poha / Indian pasta!", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Bread Slices / Toasted Cubes", note: "Zero cooking — bread soaks rich spicy gravies wonderfully", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Flattened Rice (Poha) or Oats", note: "Cooks in under 2 minutes with zero boiling pots", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "green chillies",
    aliases: ["chilli", "chili", "mirchi", "green chili"],
    name: "Green Chillies",
    category: "Spices",
    swaps: [
      { name: "Red Chilli Flakes", note: "Pantry shaker, zero eye-rubbing danger or knife chopping", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Black Pepper Powder", note: "Gentle aromatic heat that won't overwhelm", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "potato",
    aliases: ["potatoes", "aloo"],
    name: "Potato",
    category: "Vegetables",
    swaps: [
      { name: "Sweet Potato", note: "Cooks faster in the pan, rich sweetness & fiber", lazyRating: "⭐⭐⭐⭐" },
      { name: "Boiled Chickpeas", note: "Instant starchy fullness with zero peeling", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Bread Cubes", note: "Crispy sponge for pan spices", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "spinach",
    aliases: ["palak", "greens"],
    name: "Spinach / Palak",
    category: "Greens",
    swaps: [
      { name: "Kasuri Methi (Fenugreek)", note: "Concentrated dry greens that keep in pantry for a year", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Shredded Cabbage", note: "Zero slimy wilting, keeps a delightful tender crunch", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "curd",
    aliases: ["yogurt", "dahi"],
    name: "Curd / Dahi",
    category: "Dairy",
    swaps: [
      { name: "Lemon Juice in Warm Milk", note: "Instant tangy curdling for quick gravy base", lazyRating: "⭐⭐⭐⭐" },
      { name: "Tomato Puree", note: "Adds body and acidity to curries", lazyRating: "⭐⭐⭐⭐" }
    ]
  },
  {
    key: "butter",
    aliases: ["ghee", "makhan"],
    name: "Butter / Ghee",
    category: "Cooking Fat",
    swaps: [
      { name: "Cooking Oil + Pinch Salt", note: "Any neutral oil with salt replicates buttery savory finish", lazyRating: "⭐⭐⭐⭐⭐" },
      { name: "Mustard Oil", note: "Pungent traditional smoky kick when heated to smoking point", lazyRating: "⭐⭐⭐⭐" }
    ]
  }
];

// Helper to safely escape HTML strings
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper to safely escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Stop words that must never be treated as standalone ingredient candidate search targets
const STOP_WORDS = new Set([
  'green', 'red', 'yellow', 'white', 'black', 'sweet', 'fresh', 'dried', 'dry',
  'diced', 'sliced', 'chopped', 'minced', 'grated', 'crushed', 'shredded', 'boiled',
  'steamed', 'fried', 'toasted', 'cooked', 'raw', 'warm', 'hot', 'cold',
  'cup', 'cups', 'tbsp', 'tsp', 'spoon', 'spoons', 'gram', 'grams', 'ml', 'kg',
  'piece', 'pieces', 'cubes', 'cube', 'seeds', 'seed', 'puree', 'slices', 'slice',
  'batons', 'powder', 'leaves', 'leaf', 'cloves', 'clove', 'head', 'heads',
  'can', 'canned', 'packet', 'pack', 'bottle', 'jar', 'bunch',
  'cooking', 'oil', 'fat', 'food', 'mixture', 'sauce', 'dish', 'pan', 'pot', 'skillet', 'bowl', 'water', 'broth', 'plate', 'item', 'items'
]);

// Tailored culinary instructions for lazy pure veg substitutions
const SWAP_CULINARY_ADAPTATIONS = {
  // Proteins
  "Tofu": {
    actionMatcher: /(?:dice|chop|sear|saut[eé]|sear\s+paneer|cube|cut)\s*(?:the\s+)?(?:paneer|cottage\s+cheese|cubes)?[^.,;]*/gi,
    newAction: "dice Tofu cubes and sear in the pan (pat dry with a paper towel so they crisp with a golden crust)",
    shortTip: "Sear Tofu for 3-4 minutes until golden on two sides."
  },
  "Boiled Chickpeas": {
    actionMatcher: /(?:dice|chop|sear|saut[eé]|drop|sear\s+paneer)\s*(?:the\s+)?(?:paneer|potatoes?|aloo|veggies?)?[^.,;]*/gi,
    newAction: "drain and toss Boiled Chickpeas directly into the pan (zero peeling or cutting board needed!)",
    shortTip: "Boiled chickpeas are pre-cooked; toss for 2 minutes to glaze with spices."
  },
  "Toasted Bread Cubes": {
    actionMatcher: /(?:dice|chop|sear|saut[eé]|add)\s*(?:the\s+)?(?:paneer|rice)?[^.,;]*/gi,
    newAction: "toss in Toasted Bread Cubes in the final 2 minutes so they absorb the sizzling pan juices while staying crisp",
    shortTip: "Add bread croutons near the end to keep them crunchy."
  },
  "Mushroom Slices": {
    actionMatcher: /(?:dice|chop|sear|saut[eé]|add)\s*(?:the\s+)?(?:paneer)?[^.,;]*/gi,
    newAction: "sizzle sliced Mushrooms on medium heat until tender and release rich savory pan juices",
    shortTip: "Mushrooms tenderize in 3 minutes and create a savory glaze."
  },

  // Vegetables
  "Carrot Batons": {
    actionMatcher: /(?:slice|dice|chop|drop)\s*(?:the\s+)?(?:capsicum|bell\s+peppers?|peppers?)?[^.,;]*/gi,
    newAction: "drop crisp Carrot Batons into the skillet and sauté for sweet, colorful crunch",
    shortTip: "Carrot batons add bright beta-carotene and hold great bite."
  },
  "Cabbage Shreds": {
    actionMatcher: /(?:slice|dice|chop|drop)\s*(?:the\s+)?(?:capsicum|onions?|bell\s+peppers?)?[^.,;]*/gi,
    newAction: "toss Cabbage Shreds into the hot pan — they wilt quickly and caramelize with sweet flavor",
    shortTip: "Cabbage wilts sweet in under 2 minutes with zero prep bowls."
  },
  "Green Beans": {
    actionMatcher: /(?:slice|dice|chop|drop)\s*(?:the\s+)?(?:capsicum|bell\s+peppers?)?[^.,;]*/gi,
    newAction: "snap fresh Green Beans with your bare fingers directly into the pan (zero knife wash!)",
    shortTip: "Finger-snapped beans eliminate cutting boards entirely."
  },
  "Sweet Corn": {
    actionMatcher: /(?:slice|dice|chop|drop)\s*(?:the\s+)?(?:capsicum|peppers?)?[^.,;]*/gi,
    newAction: "toss Sweet Corn straight from the can or freezer for sweet golden bursts of flavor",
    shortTip: "Sweet corn warms through in 90 seconds."
  },

  // Produce & Tang
  "Tomato Ketchup / Puree": {
    actionMatcher: /(?:dice|chop|slice|drop|squeeze)\s*(?:the\s+)?(?:tomatoes?|fresh\s+tomatoes?)?[^.,;]*/gi,
    newAction: "stir in 1-2 tbsp Tomato Ketchup / Puree for instant savory umami tang (zero knife chopping!)",
    shortTip: "Tomato ketchup dissolves into the pan oils for an instant silky body."
  },
  "Lemon Juice + Pinch Sugar": {
    actionMatcher: /(?:dice|chop|slice|drop)\s*(?:the\s+)?(?:tomatoes?)?[^.,;]*/gi,
    newAction: "drizzle 1 tbsp Lemon Juice with a pinch of sugar for instant bright citrus sweet-tangy balance",
    shortTip: "Lemon + sugar mimics the natural acidity and sweetness of ripe tomatoes."
  },
  "Whisked Curd (Dahi)": {
    actionMatcher: /(?:dice|chop|slice|drop|pour)\s*(?:the\s+)?(?:tomatoes?|cream)?[^.,;]*/gi,
    newAction: "lower the flame and whisk in Curd (Dahi) to create a rich, silky gravy base",
    shortTip: "Whisk curd on low flame to prevent splitting."
  },
  "Amchur (Dry Mango Powder)": {
    actionMatcher: /(?:dice|chop|slice|drop)\s*(?:the\s+)?(?:tomatoes?|lemon)?[^.,;]*/gi,
    newAction: "dust 1/2 tsp Amchur (Dry Mango Powder) directly from your spice box for instant zesty tang",
    shortTip: "Amchur provides citrusy tang without excess moisture."
  },

  // Aromatics
  "Pinch of Hing (Asafoetida)": {
    actionMatcher: /(?:slice|dice|chop|sear|saut[eé])\s*(?:the\s+)?(?:onions?|garlic)?[^.,;]*/gi,
    newAction: "crackle a pinch of Hing (Asafoetida) in the hot oil (savory onion-garlic aroma with zero chopping tears!)",
    shortTip: "Hing bloomed in warm oil delivers rich savory umami with zero chopping."
  },
  "Garlic Powder": {
    actionMatcher: /(?:mince|crush|peel|chop|dice)\s*(?:the\s+)?(?:garlic|garlic\s+cloves?)?[^.,;]*/gi,
    newAction: "dust 1/4 tsp Garlic Powder into the sizzling pan (zero sticky peeling!)",
    shortTip: "Garlic powder distributes evenly and never scorches."
  },
  "Dry Ginger Powder (Sonth)": {
    actionMatcher: /(?:grate|peel|chop|crush)\s*(?:the\s+)?(?:ginger|fresh\s+ginger)?[^.,;]*/gi,
    newAction: "dust 1/4 tsp Dry Ginger Powder (Sonth) from your spice box for warm concentrated kick",
    shortTip: "Sonth has potent warmth — 1/4 tsp is plenty."
  },

  // Carbs
  "Leftover Torn Roti": {
    actionMatcher: /(?:pour|add|steam|cook)\s*(?:the\s+)?(?:rice|basmati\s+rice)?[^.,;]*/gi,
    newAction: "tear leftover Rotis with your hands into bite-sized noodles and toss in the hot pan juices (instant roti pasta!)",
    shortTip: "Torn rotis soak up hot spices and pan juices in 2 minutes."
  },
  "Bread Slices / Toasted Cubes": {
    actionMatcher: /(?:pour|add|steam|cook)\s*(?:the\s+)?(?:rice)?[^.,;]*/gi,
    newAction: "tear bread slices into cubes and toss in to soak up every drop of seasoned pan sauce",
    shortTip: "Bread acts like an edible sponge with zero grain boiling."
  },
  "Flattened Rice (Poha) or Oats": {
    actionMatcher: /(?:pour|add|steam|cook)\s*(?:the\s+)?(?:rice)?[^.,;]*/gi,
    newAction: "rinse Poha or Oats quickly and toss into the pan — cooks in under 2 minutes!",
    shortTip: "Poha or quick oats cook directly in residual pan steam in 90 seconds."
  },

  // Herbs & Spices
  "Dried Kasuri Methi": {
    actionMatcher: /(?:chop|garnish\s+with|fold\s+in|sprinkle)\s*(?:the\s+)?(?:coriander|cilantro|fresh\s+coriander)?[^.,;]*/gi,
    newAction: "crush dried Kasuri Methi between dry palms and sprinkle on top for rich restaurant aroma",
    shortTip: "Rubbing Kasuri Methi between your palms releases aromatic essential oils."
  },
  "Mustard Seeds (Rai)": {
    actionMatcher: /(?:crackle|toast|add)\s*(?:the\s+)?(?:cumin|cumin\s+seeds)?[^.,;]*/gi,
    newAction: "crackle Mustard Seeds (Rai) in the hot oil until popping and nutty",
    shortTip: "Mustard seeds give a delightful nutty crackle and peppy tadka fragrance."
  },
  "Ajwain (Carom Seeds)": {
    actionMatcher: /(?:crackle|toast|add)\s*(?:the\s+)?(?:cumin|cumin\s+seeds)?[^.,;]*/gi,
    newAction: "crackle a pinch of Ajwain (Carom Seeds) in hot oil for herbal warmth and digestive comfort",
    shortTip: "Ajwain has a pleasant thyme-like aroma that aids digestion."
  },
  "Red Chilli Flakes": {
    actionMatcher: /(?:chop|dice|slice|add)\s*(?:the\s+)?(?:green\s+chillies?|chillies?)?[^.,;]*/gi,
    newAction: "shake Red Chilli Flakes directly from the jar (controlled heat, zero chilli hands!)",
    shortTip: "Chilli flakes let you calibrate heat without spicy fingertips."
  }
};

const LazySubstitutions = {
  db: LAZY_SUBSTITUTIONS_DB,

  // Find all active substitutions applicable to the current recipe ingredients
  getActiveSubstitutions(recipeIngredients = []) {
    if (!Array.isArray(recipeIngredients) || recipeIngredients.length === 0) {
      return [];
    }

    const matches = [];

    recipeIngredients.forEach(ing => {
      const ingLower = ing.toLowerCase();

      const found = this.db.find(item => {
        if (ingLower.includes(item.key)) return true;
        if (item.aliases && item.aliases.some(alias => ingLower.includes(alias))) return true;
        return false;
      });

      if (found && !matches.some(m => m.key === found.key)) {
        matches.push({
          originalIngredient: ing,
          item: found
        });
      }
    });

    return matches;
  },

  ensureBaseRecipe(recipe) {
    if (!recipe) return;
    if (!recipe._base) {
      recipe._base = {
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: Array.isArray(recipe.ingredients) ? [...recipe.ingredients] : [],
        steps: Array.isArray(recipe.steps) ? [...recipe.steps] : [],
        singleDishTip: recipe.singleDishTip || ''
      };
    }
    if (!recipe._activeSwaps) {
      recipe._activeSwaps = {};
    }
  },

  getCandidateTerms(itemKey, originalName) {
    const item = itemKey ? this.db.find(i => i.key === itemKey) : null;
    const candidates = new Set();

    if (itemKey) candidates.add(itemKey.toLowerCase().trim());

    if (item?.name) {
      item.name.split('/').forEach(part => {
        const clean = part.replace(/[()[\]{}]/g, '').trim().toLowerCase();
        if (clean.length > 2 && !STOP_WORDS.has(clean)) candidates.add(clean);
      });
    }

    if (item?.aliases && Array.isArray(item.aliases)) {
      item.aliases.forEach(alias => {
        const clean = alias.replace(/[()[\]{}]/g, '').trim().toLowerCase();
        if (clean.length > 2 && !STOP_WORDS.has(clean)) candidates.add(clean);
      });
    }

    if (originalName) {
      // Isolate branches if separated by "/" or " or " (e.g. "Cooking Oil or Butter" -> ["Cooking Oil", "Butter"])
      const branches = originalName.split(/\s*(?:\/|\bor\b)\s*/i);
      const relevantBranch = branches.find(b => {
        const bLower = b.toLowerCase();
        if (itemKey && bLower.includes(itemKey.toLowerCase())) return true;
        if (item?.aliases && item.aliases.some(a => bLower.includes(a.toLowerCase()))) return true;
        return false;
      }) || (branches.length === 1 ? originalName : '');

      if (relevantBranch) {
        const cleaned = relevantBranch
          .replace(/\([^)]*\)/g, '')
          .replace(/\b\d+(?:g|ml|cups?|tbsp|tsp)?\b/gi, '')
          .replace(/[()[\]{}]/g, '')
          .trim();
        const cleanedLower = cleaned.toLowerCase();

        // Only add if the term actually contains the target itemKey or an alias
        const isRelevant = (itemKey && cleanedLower.includes(itemKey.toLowerCase())) ||
          (item?.aliases && item.aliases.some(a => cleanedLower.includes(a.toLowerCase())));

        if (isRelevant && cleanedLower.length > 2 && !STOP_WORDS.has(cleanedLower)) {
          candidates.add(cleanedLower);
        }

        const words = cleaned.split(/\s+/).filter(w => {
          const lower = w.toLowerCase();
          return lower.length > 2 && !STOP_WORDS.has(lower);
        });

        words.forEach(w => {
          const lower = w.toLowerCase();
          // STRICT RULE: Only add if this word is the itemKey or an alias (never unrelated words like "cooking" or "oil")
          if (lower === itemKey?.toLowerCase() || (item?.aliases && item.aliases.some(a => a.toLowerCase() === lower))) {
            candidates.add(lower);
          }
        });
      }
    }

    return Array.from(candidates).sort((a, b) => b.length - a.length);
  },

  rebuildRecipeWithSwaps(recipe) {
    if (!recipe?._base) return;

    let newTitle = recipe._base.title;
    let newDesc = recipe._base.description;
    let newIngredients = [...recipe._base.ingredients];
    let newSteps = [...recipe._base.steps];
    let newTip = recipe._base.singleDishTip;

    const activeKeys = Object.keys(recipe._activeSwaps || {});
    if (activeKeys.length === 0) {
      recipe.title = newTitle;
      recipe.description = newDesc;
      recipe.ingredients = newIngredients;
      recipe.steps = newSteps;
      recipe.singleDishTip = newTip;
      return;
    }

    activeKeys.forEach(itemKey => {
      const swapInfo = recipe._activeSwaps[itemKey];
      if (!swapInfo) return;
      const { originalName, swapName, swapNote } = swapInfo;
      const item = this.db.find(i => i.key === itemKey);
      const candidates = this.getCandidateTerms(itemKey, originalName);
      if (candidates.length === 0) return;

      const regex = new RegExp(`\\b(?:${candidates.map(escapeRegExp).join('|')})(?:s|es)?\\b`, 'gi');
      const adaptation = SWAP_CULINARY_ADAPTATIONS[swapName];
      const targetDisplayName = item?.name ? item.name.split('/')[0].trim() : (itemKey.charAt(0).toUpperCase() + itemKey.slice(1));
      const styledSwap = `<strong class="text-emerald-dark dark:text-emerald-light underline decoration-emerald decoration-2">${swapName}</strong>`;

      // Helper to collapse slash/conjunction alternatives like "oil/butter" -> swapName cleanly
      const collapseCompoundAlternatives = (text) => {
        if (!text || typeof text !== 'string') return text;
        let s = text;
        if (itemKey === 'butter') {
          s = s.replace(/(?:cooking\s+)?oil\s*(?:\/|\bor\b)\s*(?:butter|ghee)\b/gi, styledSwap);
          s = s.replace(/\b(?:butter|ghee)\s*(?:\/|\bor\b)\s*(?:cooking\s+)?oil\b/gi, styledSwap);
        } else if (itemKey === 'cream') {
          s = s.replace(/(?:fresh\s+)?milk\s*(?:\/|\bor\b)\s*(?:fresh\s+)?cream\b/gi, styledSwap);
          s = s.replace(/\b(?:fresh\s+)?cream\s*(?:\/|\bor\b)\s*(?:fresh\s+)?milk\b/gi, styledSwap);
        }
        return s;
      };

      // 1. Update Title cleanly
      if (newTitle) {
        newTitle = collapseCompoundAlternatives(newTitle);
        newTitle = newTitle.replace(regex, swapName);
      }

      // 2. Update Description cleanly
      if (newDesc) {
        newDesc = collapseCompoundAlternatives(newDesc);
        newDesc = newDesc.replace(regex, swapName);
      }

      // 3. Update Ingredients array (clean 1-to-1 replacement, never duplicated)
      let replacedIng = false;
      newIngredients = newIngredients.map(ing => {
        if (!replacedIng && regex.test(ing)) {
          regex.lastIndex = 0;
          replacedIng = true;
          return `${swapName} (Substituted for ${targetDisplayName})`;
        }
        regex.lastIndex = 0;
        return ing;
      });
      if (!replacedIng) {
        newIngredients = newIngredients.map(ing => {
          if (!replacedIng && ing.toLowerCase().includes(itemKey.toLowerCase())) {
            replacedIng = true;
            return `${swapName} (Substituted for ${targetDisplayName})`;
          }
          return ing;
        });
      }

      // 4. Update Steps in single pass
      let stepMatchCount = 0;
      let firstMatchIndex = -1;

      newSteps = newSteps.map((step, idx) => {
        // Pre-collapse compound alternatives like "oil/butter" before general matching
        let processedStep = collapseCompoundAlternatives(step);
        if (processedStep !== step) {
          stepMatchCount++;
          if (firstMatchIndex === -1) firstMatchIndex = idx;
          return processedStep;
        }

        // Check if tailored culinary adaptation applies
        if (adaptation?.actionMatcher && adaptation.actionMatcher.test(processedStep)) {
          adaptation.actionMatcher.lastIndex = 0;
          stepMatchCount++;
          if (firstMatchIndex === -1) firstMatchIndex = idx;
          return processedStep.replace(adaptation.actionMatcher, adaptation.newAction);
        }

        // Single-pass replacement for candidate words in this step
        if (regex.test(processedStep)) {
          regex.lastIndex = 0;
          stepMatchCount++;
          if (firstMatchIndex === -1) firstMatchIndex = idx;
          return processedStep.replace(regex, styledSwap);
        }

        regex.lastIndex = 0;
        return processedStep;
      });

      // Add badge to ONLY the first modified step (avoids repeating badge across multiple steps)
      if (firstMatchIndex !== -1) {
        const targetStep = newSteps[firstMatchIndex];
        if (!targetStep.includes('Swap:')) {
          newSteps[firstMatchIndex] = `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-bg dark:bg-emerald/20 text-emerald-dark dark:text-emerald-light border border-emerald/30 mr-1.5 shadow-sm">🔄 Swap: ${swapName}</span> ` + targetStep;
        }
      } else {
        // If ingredient was not mentioned by name in any step, insert exactly ONE guidance step
        const guidance = adaptation
          ? `<strong>${swapName} Swap:</strong> ${adaptation.newAction}.`
          : `<strong>${swapName} Swap:</strong> Use ${swapName} in place of ${targetDisplayName} during the main cooking step.`;

        const insertIdx = Math.min(1, newSteps.length);
        newSteps.splice(insertIdx, 0, `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-bg dark:bg-emerald/20 text-emerald-dark dark:text-emerald-light border border-emerald/30 mr-1.5 shadow-sm">🔄 Swap Step</span> ${guidance}`);
      }

      // 5. Update single-dish pro-tip
      if (swapNote) {
        const shortNote = swapNote.split(',')[0].trim();
        newTip = `Substituted with ${swapName} (${shortNote}). ` + (newTip || '');
      }
    });

    // Deduplicate ingredients list cleanly
    recipe.ingredients = Array.from(new Set(newIngredients));
    recipe.title = newTitle;
    recipe.description = newDesc;
    recipe.steps = newSteps;
    recipe.singleDishTip = newTip;
  },

  // AI-Powered Instruction Rephraser with Multi-Tier Fallback
  async rephraseRecipeWithAI(recipe, activeSwapName = '') {
    if (!recipe?._base) return;

    const hasSwaps = recipe._activeSwaps && Object.keys(recipe._activeSwaps).length > 0;
    if (!hasSwaps) {
      recipe.title = recipe._base.title;
      recipe.description = recipe._base.description;
      recipe.ingredients = [...recipe._base.ingredients];
      recipe.steps = [...recipe._base.steps];
      recipe.singleDishTip = recipe._base.singleDishTip;
      return;
    }

    const apiKey = window.state?.geminiApiKey?.trim();
    const canUseAI = apiKey && apiKey.length > 10 && typeof window.callGeminiRephraseRecipeWithSwaps === 'function';

    const loadingOverlay = document.getElementById('recipe-loading-overlay');
    const titleEl = document.getElementById('loading-status-title');
    const subEl = document.getElementById('loading-status-subtitle');

    if (canUseAI) {
      if (loadingOverlay) {
        if (titleEl) titleEl.textContent = "Chef AI Adapting Recipe...";
        if (subEl) subEl.textContent = `Intelligently rephrasing cooking steps for ${activeSwapName || 'swapped ingredients'}...`;
        loadingOverlay.classList.remove('hidden');
      }

      try {
        const aiRecipe = await window.callGeminiRephraseRecipeWithSwaps(recipe._base, recipe._activeSwaps, apiKey);
        if (aiRecipe && Array.isArray(aiRecipe.steps) && aiRecipe.steps.length > 0) {
          recipe.title = aiRecipe.title;
          recipe.description = aiRecipe.description;
          recipe.ingredients = aiRecipe.ingredients;

          // Convert any [Swap: ...] tags in steps into visual badges
          recipe.steps = aiRecipe.steps.map(step => {
            let s = step;
            s = s.replace(/\[(?:Swap|Substituted):\s*([^\]]+)\]/gi, (m, name) => {
              return `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-bg dark:bg-emerald/20 text-emerald-dark dark:text-emerald-light border border-emerald/30 mr-1.5 shadow-sm">🔄 Swap: ${escapeHtml(name.trim())}</span>`;
            });
            return s;
          });

          if (aiRecipe.singleDishTip) recipe.singleDishTip = aiRecipe.singleDishTip;

          if (typeof showToast === 'function') {
            showToast(`Recipe rephrased by Gemini AI for ${activeSwapName || 'swapped items'}!`, "✨");
          }
          return;
        }
      } catch (err) {
        console.warn("Gemini rephrasing note, engaging local culinary heuristic adaptation:", err);
      } finally {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
      }
    }

    // Local heuristic engine fallback
    this.rebuildRecipeWithSwaps(recipe);
    if (typeof showToast === 'function') {
      showToast(`Lazy Swap: Instructions adapted for ${activeSwapName || 'swapped items'}.`, "🔄");
    }
  },

  // Apply a swap into the live recipe, using AI to intelligently rephrase instructions
  async applyLazySwap(originalName, swapName, itemKey = null, swapNote = null) {
    if (!window.state?.currentRecipe) return;

    const recipe = window.state.currentRecipe;
    this.ensureBaseRecipe(recipe);

    if (!itemKey) {
      const found = this.db.find(i => originalName.toLowerCase().includes(i.key));
      itemKey = found ? found.key : originalName.toLowerCase().trim();
    }

    // Toggle behavior: clicking active swap reverts back to original
    if (recipe._activeSwaps[itemKey]?.swapName === swapName) {
      delete recipe._activeSwaps[itemKey];
      await this.rephraseRecipeWithAI(recipe);
      if (window.audio) window.audio.playPop();
      if (typeof showToast === 'function') {
        showToast(`Reverted back to original: "${originalName}"`, "↩️");
      }
      if (typeof renderRecipeCard === 'function') {
        renderRecipeCard(recipe);
      }
      return;
    }

    recipe._activeSwaps[itemKey] = {
      originalName,
      swapName,
      swapNote
    };

    await this.rephraseRecipeWithAI(recipe, swapName);

    if (window.audio) window.audio.playPop();
    if (typeof renderRecipeCard === 'function') {
      renderRecipeCard(recipe);
    }
  },

  // Render the Lazy Substitutions section in the recipe card
  renderSubstitutionsWidget(recipe) {
    const container = document.getElementById('recipe-substitutions-container');
    if (!container) return;

    this.ensureBaseRecipe(recipe);

    // Check against BASE recipe ingredients so substitutions don't vanish once clicked!
    const ingredientsToCheck = recipe._base?.ingredients || recipe.ingredients || [];
    const activeMatches = this.getActiveSubstitutions(ingredientsToCheck);

    if (activeMatches.length === 0) {
      container.innerHTML = `
        <div class="p-3.5 rounded-xl bg-cream-100 dark:bg-[#14110f] border border-beige dark:border-[#2e2621] text-xs text-roasted-muted dark:text-cream-300 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔄</span>
            <span><strong>Zero-Store Swaps:</strong> All ingredients in this recipe look simple & accessible!</span>
          </div>
          <button type="button" id="open-all-swaps-btn" class="px-3 py-1 rounded-lg border border-roasted dark:border-[#52453e] bg-cream-200 dark:bg-[#2c2622] hover:bg-cream-300 font-bold text-xs shadow-tactile-sm transition-all text-roasted dark:text-cream-100 cursor-pointer">
            Browse All Swaps
          </button>
        </div>
      `;
      this.bindOpenModalBtn();
      return;
    }

    let html = `
      <div class="p-4 rounded-xl bg-sloth-soft/40 dark:bg-[#221b16] border-2 border-sloth-amber/40">
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔄</span>
            <h4 class="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-sloth-amber">
              Lazy Substitutions (Zero-Store Swaps)
            </h4>
          </div>
          <button type="button" id="open-all-swaps-btn" class="text-xs font-bold underline underline-offset-2 text-emerald-dark dark:text-emerald-light hover:opacity-80 cursor-pointer">
            View All Swaps
          </button>
        </div>

        <p class="text-xs text-roasted-muted dark:text-cream-300/80 mb-3 leading-relaxed">
          Missing an ingredient? Don't leave your couch — tap any pantry alternative below to swap it instantly into your recipe (tap again to revert):
        </p>

        <div class="space-y-2.5">
    `;

    activeMatches.forEach(match => {
      const orig = match.originalIngredient;
      const item = match.item;
      const currentSwap = recipe._activeSwaps?.[item.key];

      html += `
        <div class="p-3 rounded-lg bg-cream-50 dark:bg-[#14110f] border border-beige dark:border-[#2e2621]">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs sm:text-sm font-bold text-roasted dark:text-cream-100 flex items-center gap-1.5">
              <span>Missing <strong>${escapeHtml(orig)}</strong>?</span>
              ${currentSwap ? `<span class="text-[11px] font-bold text-emerald dark:text-emerald-light bg-emerald-bg dark:bg-emerald/20 px-2 py-0.5 rounded border border-emerald/30">Active: ${escapeHtml(currentSwap.swapName)}</span>` : ''}
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cream-200 dark:bg-[#2c2622] text-roasted-muted dark:text-cream-300 uppercase font-semibold">
              ${escapeHtml(item.category)}
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5">
      `;

      item.swaps.forEach(swap => {
        const isSelected = currentSwap?.swapName === swap.name;
        const btnClasses = isSelected
          ? "lazy-swap-action-btn active-swap group text-xs px-2.5 py-1 rounded-lg border-2 border-emerald bg-emerald text-cream-50 font-bold transition-all flex items-center gap-1.5 text-left cursor-pointer active:scale-95 shadow-sm"
          : "lazy-swap-action-btn group text-xs px-2.5 py-1 rounded-lg border border-roasted/30 dark:border-[#423832] bg-cream-100 dark:bg-[#25201c] hover:bg-emerald-bg dark:hover:bg-emerald/20 hover:border-emerald text-roasted dark:text-cream-100 transition-all flex items-center gap-1.5 text-left cursor-pointer active:scale-95";

        const iconHtml = isSelected
          ? `<span class="font-bold text-cream-50">✓</span>`
          : `<span class="font-bold text-emerald">⇄</span>`;

        html += `
          <button 
            type="button" 
            class="${btnClasses}"
            data-original="${escapeHtml(orig)}"
            data-key="${escapeHtml(item.key)}"
            data-swap="${escapeHtml(swap.name)}"
            data-note="${escapeHtml(swap.note)}"
            title="${isSelected ? 'Active swap (click to revert)' : escapeHtml(swap.note)}"
          >
            ${iconHtml}
            <span class="${isSelected ? 'text-cream-50' : 'font-medium group-hover:text-emerald-dark dark:group-hover:text-emerald-light'}">${escapeHtml(swap.name)}</span>
            <span class="text-[10px] ${isSelected ? 'text-cream-100/90' : 'opacity-70'} hidden sm:inline">(${escapeHtml(swap.note.split(',')[0])})</span>
          </button>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach click listeners to swap buttons
    container.querySelectorAll('.lazy-swap-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orig = btn.getAttribute('data-original');
        const swap = btn.getAttribute('data-swap');
        const key = btn.getAttribute('data-key');
        const note = btn.getAttribute('data-note');
        if (orig && swap) {
          this.applyLazySwap(orig, swap, key, note);
        }
      });
    });

    this.bindOpenModalBtn();
  },

  bindOpenModalBtn() {
    const btn = document.getElementById('open-all-swaps-btn');
    btn?.addEventListener('click', () => {
      this.openAllSwapsModal();
      if (window.audio) window.audio.playClick();
    });
  },

  // Modal displaying the full searchable database of pure veg swaps
  openAllSwapsModal() {
    const modal = document.getElementById('lazy-swaps-modal');
    if (!modal) return;

    this.renderAllSwapsList('');
    modal.classList.remove('hidden');

    const searchInput = document.getElementById('swaps-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
  },

  renderAllSwapsList(filterText = '') {
    const listEl = document.getElementById('swaps-modal-list');
    if (!listEl) return;

    const query = filterText.toLowerCase().trim();

    const filtered = this.db.filter(item => {
      if (!query) return true;
      if (item.name.toLowerCase().includes(query)) return true;
      if (item.key.toLowerCase().includes(query)) return true;
      if (item.category.toLowerCase().includes(query)) return true;
      if (item.aliases && item.aliases.some(a => a.toLowerCase().includes(query))) return true;
      if (item.swaps.some(s => s.name.toLowerCase().includes(query) || s.note.toLowerCase().includes(query))) return true;
      return false;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="py-12 text-center text-xs text-roasted-muted dark:text-cream-300/60">
          <span class="text-3xl block mb-2">🔍</span>
          <p class="font-bold text-sm text-roasted dark:text-cream-100">No substitutions found for "${escapeHtml(filterText)}"</p>
          <p class="mt-1">Try searching for "paneer", "tomato", "onion", "rice", or "ginger".</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => `
      <div class="p-4 rounded-xl border-2 border-roasted dark:border-[#382f2a] bg-cream-100 dark:bg-[#14110f] space-y-2">
        <div class="flex items-center justify-between pb-1.5 border-b border-beige dark:border-[#2e2621]">
          <h4 class="font-display font-bold text-base text-roasted dark:text-cream-50 flex items-center gap-2">
            <span>${escapeHtml(item.name)}</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cream-200 dark:bg-[#2c2622] text-roasted-muted dark:text-cream-300 font-semibold uppercase">
              ${escapeHtml(item.category)}
            </span>
          </h4>
          <span class="text-xs text-emerald dark:text-emerald-light font-semibold">Zero-Store Alternatives</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          ${item.swaps.map(swap => `
            <div class="p-2.5 rounded-lg bg-cream-50 dark:bg-[#1c1815] border border-beige dark:border-[#2e2621] flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-emerald-dark dark:text-emerald-light">✓ ${escapeHtml(swap.name)}</span>
                <span class="text-[10px] text-sloth-amber">${escapeHtml(swap.lazyRating)}</span>
              </div>
              <p class="text-xs text-roasted-muted dark:text-cream-300/80 mt-1 leading-snug">${escapeHtml(swap.note)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  setupModalEvents() {
    const modal = document.getElementById('lazy-swaps-modal');
    const closeBtn = document.getElementById('close-swaps-modal');
    const searchInput = document.getElementById('swaps-search-input');
    const headerBtn = document.getElementById('open-header-swaps-btn');

    if (!modal) return;

    headerBtn?.addEventListener('click', () => {
      this.openAllSwapsModal();
      if (window.audio) window.audio.playClick();
    });

    closeBtn?.addEventListener('click', () => {
      modal.classList.add('hidden');
      if (window.audio) window.audio.playClick();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });

    searchInput?.addEventListener('input', (e) => {
      this.renderAllSwapsList(e.target.value);
    });
  }
};

window.LazySubstitutions = LazySubstitutions;
