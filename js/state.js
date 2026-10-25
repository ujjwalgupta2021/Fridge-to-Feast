/**
 * Fridge-to-Feast | Reactive State Management & Persistence
 * Manages user vegetarian inventory, energy settings, and local storage sync
 */

let state = {
  inventory: [],
  energyMode: 1, // Default: One-Pan Stir-Fry
  minimizeDishes: true,
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash-latest',
  geminiApiVersion: 'v1beta',
  savedRecipes: [],
  currentRecipe: null,
  soundEnabled: true,
  theme: 'light',
  uploadedImageBase64: null,
  uploadedImageMime: null
};

function loadStateFromStorage() {
  try {
    const storedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const rawInv = storedInventory ? JSON.parse(storedInventory) : [...DEFAULT_INVENTORY];
    state.inventory = rawInv
      .map(item => (typeof item === 'string' ? item.replace(/[()[\]{}?*]/g, '').trim() : ''))
      .filter(item => item.length > 0)
      .filter(item => (typeof isPureVegetarian === 'function' ? isPureVegetarian(item) : true));

    const storedEnergy = localStorage.getItem(STORAGE_KEYS.ENERGY_MODE);
    state.energyMode = storedEnergy !== null ? parseInt(storedEnergy, 10) : 1;

    const storedDishes = localStorage.getItem(STORAGE_KEYS.MINIMIZE_DISHES);
    state.minimizeDishes = storedDishes !== null ? JSON.parse(storedDishes) : true;

    state.geminiApiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
    state.geminiModel = localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL) || 'gemini-1.5-flash-latest';
    state.geminiApiVersion = localStorage.getItem(STORAGE_KEYS.GEMINI_API_VERSION) || 'v1beta';

    // Sanitize stale Gemma or non-Gemini models from localStorage
    if (!state.geminiModel ||
        state.geminiModel.toLowerCase().includes('gemma') ||
        !state.geminiModel.toLowerCase().startsWith('gemini')) {
      state.geminiModel = 'gemini-1.5-flash-latest';
      state.geminiApiVersion = 'v1beta';
      localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, 'gemini-1.5-flash-latest');
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_VERSION, 'v1beta');
    }

    // Bare gemini-1.5-flash must use v1 endpoint (v1beta throws 404)
    if (state.geminiModel === 'gemini-1.5-flash' && state.geminiApiVersion === 'v1beta') {
      state.geminiApiVersion = 'v1';
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_VERSION, 'v1');
    }

    const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
    state.savedRecipes = storedSaved ? JSON.parse(storedSaved) : [];

    const storedSound = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    state.soundEnabled = storedSound !== null ? JSON.parse(storedSound) : true;

    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    state.theme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (typeof applyTheme === 'function') {
      applyTheme(state.theme);
    }
  } catch (err) {
    console.error("Error loading localStorage state, using defaults:", err);
    state.inventory = [...DEFAULT_INVENTORY];
  }
}

function saveInventoryToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(state.inventory));
  } catch (e) {
    console.warn("Storage quota exceeded", e);
  }
}

function saveSavedRecipesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(state.savedRecipes));
  } catch (e) {}
}

function addSingleOrBulkIngredients(inputString) {
  if (!inputString || !inputString.trim()) return;

  // Split by commas, newlines, or semicolons
  const items = inputString
    .split(/[,;\n]+/)
    .map(i => i.trim())
    .filter(i => i.length > 0);

  let addedCount = 0;
  const rejectedNonVeg = [];

  items.forEach(rawItem => {
    // Clean brackets, symbols, packaging, and uncertainty words
    let clean = rawItem
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/\{[^}]*\)/g, ' ')
      .replace(/[?!*#~`"';:+=_\\/|<>@$%^&]/g, ' ')
      .replace(/\b(maybe|possibly|probably|unknown|optional|bottle|carton|plastic|container|jar|can|package|bag)\b/gi, ' ')
      .trim()
      .replace(/\s+/g, ' ');

    if (!clean || clean.length < 2) return;

    // STRICT CHECK: Reject any non-vegetarian items (meat, chicken, fish, seafood, eggs, etc.)
    if (typeof isPureVegetarian === 'function' && !isPureVegetarian(clean)) {
      rejectedNonVeg.push(clean);
      return;
    }

    // Format: Capitalize words cleanly
    const formatted = clean
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const stem = typeof getCanonicalStem === 'function' ? getCanonicalStem(formatted) : formatted.toLowerCase();
    const exists = state.inventory.some(existing => {
      if (existing.toLowerCase() === formatted.toLowerCase()) return true;
      if (typeof getCanonicalStem === 'function' && getCanonicalStem(existing) === stem) return true;
      return false;
    });

    if (!exists) {
      state.inventory.push(formatted);
      addedCount++;
    }
  });

  // Alert user immediately if any non-vegetarian items were rejected
  if (rejectedNonVeg.length > 0) {
    if (typeof showToast === 'function') {
      showToast(`🚫 Strictly Pure Veg: Excluded non-veg item(s): ${rejectedNonVeg.join(', ')}`, '🥦');
    }
    if (window.audio) window.audio.playClick();
  }

  if (addedCount > 0) {
    saveInventoryToStorage();
    if (typeof renderInventoryChips === 'function') renderInventoryChips();
    if (typeof renderPantryStaples === 'function') renderPantryStaples();
    if (window.audio) window.audio.playPop();
    if (typeof showToast === 'function') {
      showToast(`Added ${addedCount} pure veg ingredient${addedCount > 1 ? 's' : ''}!`, '🧺');
    }
  } else if (rejectedNonVeg.length === 0) {
    if (typeof showToast === 'function') {
      showToast("Items already in inventory!", "ℹ️");
    }
  }
}

function removeIngredientByIndex(index) {
  if (index >= 0 && index < state.inventory.length) {
    const removed = state.inventory.splice(index, 1);
    saveInventoryToStorage();
    if (typeof renderInventoryChips === 'function') renderInventoryChips();
    if (typeof renderPantryStaples === 'function') renderPantryStaples();
    if (window.audio) window.audio.playClick();
    if (typeof showToast === 'function') {
      showToast(`Removed ${removed[0]}`, '🗑️');
    }
  }
}

function clearAllInventory() {
  if (state.inventory.length === 0) return;
  state.inventory = [];
  saveInventoryToStorage();
  if (typeof renderInventoryChips === 'function') renderInventoryChips();
  if (typeof renderPantryStaples === 'function') renderPantryStaples();
  if (window.audio) window.audio.playClick();
  if (typeof showToast === 'function') {
    showToast("Fridge inventory cleared", "🧹");
  }
}

function restoreDefaultInventory() {
  state.inventory = [...DEFAULT_INVENTORY];
  saveInventoryToStorage();
  if (typeof renderInventoryChips === 'function') renderInventoryChips();
  if (typeof renderPantryStaples === 'function') renderPantryStaples();
  if (window.audio) window.audio.playPop();
  if (typeof showToast === 'function') {
    showToast("Restored sample pure veg ingredients", "🥗");
  }
}

// Bind to window for global access
window.state = state;
window.loadStateFromStorage = loadStateFromStorage;
window.saveInventoryToStorage = saveInventoryToStorage;
window.saveSavedRecipesToStorage = saveSavedRecipesToStorage;
window.addSingleOrBulkIngredients = addSingleOrBulkIngredients;
window.removeIngredientByIndex = removeIngredientByIndex;
window.clearAllInventory = clearAllInventory;
window.restoreDefaultInventory = restoreDefaultInventory;
