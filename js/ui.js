/**
 * Fridge-to-Feast | UI Rendering & Interactive Modals
 * Visual layout bindings, themes, toast notifications, and modal controls
 */

// Helper: Escape HTML string to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render Inventory Badges with green 🟢 indicator
function renderInventoryChips() {
  const container = document.getElementById('inventory-chips-container');
  const countBadge = document.getElementById('inventory-badge-count');
  if (!container || !countBadge || !window.state) return;

  countBadge.textContent = window.state.inventory.length;

  if (window.state.inventory.length === 0) {
    container.innerHTML = `
      <div class="w-full py-8 text-center text-xs text-roasted-muted dark:text-cream-300/60 flex flex-col items-center justify-center space-y-1">
        <span class="text-2xl">🧺</span>
        <p class="font-medium text-roasted dark:text-cream-200">Your fridge is completely empty!</p>
        <p class="text-[11px]">Drop a photo or add ingredients above.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = window.state.inventory.map((item, idx) => `
    <span class="ingredient-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-50 dark:bg-[#1c1815] border-2 border-roasted dark:border-[#52453e] text-roasted dark:text-cream-100 shadow-tactile-sm transition-all hover:scale-105 select-none" data-item="${escapeHtml(item)}">
      <span class="w-2 h-2 rounded-full bg-emerald animate-pulse flex-shrink-0" title="100% Pure Veg"></span>
      <span class="font-medium">${escapeHtml(item)}</span>
      <button type="button" class="remove-chip-btn ml-0.5 text-roasted-muted hover:text-rose-600 dark:hover:text-rose-400 focus:outline-none transition-colors" data-index="${idx}" aria-label="Remove ${escapeHtml(item)}">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    </span>
  `).join('');

  if (window.lucide) window.lucide.createIcons();

  // Attach chip removal listeners
  container.querySelectorAll('.remove-chip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-index'), 10);
      removeIngredientByIndex(index);
    });
  });
}

// Render Pantry Staple quick-add buttons
function renderPantryStaples() {
  const container = document.getElementById('pantry-staples-container');
  if (!container || !window.PANTRY_STAPLES || !window.state) return;

  container.innerHTML = window.PANTRY_STAPLES.map(staple => {
    const isAdded = window.state.inventory.some(i => i.toLowerCase() === staple.toLowerCase());
    return `
      <button 
        type="button" 
        class="staple-pill-btn text-xs px-2 py-1 rounded-md border text-roasted dark:text-cream-100 transition-all ${
          isAdded 
            ? 'bg-emerald-bg dark:bg-emerald/20 border-emerald/40 text-emerald-dark dark:text-emerald-light font-medium' 
            : 'bg-cream-100 dark:bg-[#2c2622] border-beige dark:border-[#382f2a] hover:border-roasted dark:hover:border-cream-300 hover:bg-cream-200 dark:hover:bg-[#382f2a]'
        }"
        data-staple="${escapeHtml(staple)}"
      >
        ${isAdded ? '✓ ' : '+ '}${escapeHtml(staple)}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.staple-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const staple = btn.getAttribute('data-staple');
      if (staple) {
        addSingleOrBulkIngredients(staple);
        if (window.audio) window.audio.playPop();
      }
    });
  });
}

// Update Slider and Effort Box
function updateEnergyModeUI() {
  const modes = window.ENERGY_MODES || [];
  const mode = modes[window.state?.energyMode] || modes[1];
  
  const slider = document.getElementById('energy-slider');
  const nameLabel = document.getElementById('current-energy-mode-name');
  const emoji = document.getElementById('effort-emoji');
  const text = document.getElementById('effort-text');

  if (slider && window.state) slider.value = window.state.energyMode;
  if (nameLabel) nameLabel.textContent = mode.name;
  if (emoji) emoji.textContent = mode.emoji;
  if (text) text.innerHTML = mode.description;

  if (window.state) {
    localStorage.setItem(STORAGE_KEYS.ENERGY_MODE, window.state.energyMode);
  }
}

// Update Minimize Dishes UI Card, Badge, and Subtitle
function updateMinimizeDishesUI() {
  const toggle = document.getElementById('minimize-dishes-toggle');
  const badge = document.getElementById('minimize-dishes-badge');
  const desc = document.getElementById('minimize-dishes-desc');
  const card = document.getElementById('minimize-dishes-card');
  if (!toggle || !window.state) return;

  const isLocked = window.state.minimizeDishes;
  toggle.checked = isLocked;

  if (badge) {
    if (isLocked) {
      badge.textContent = "Locked 1-Vessel";
      badge.className = "text-xs px-2 py-0.5 rounded bg-emerald text-cream-50 font-bold uppercase transition-all shadow-tactile-sm";
    } else {
      badge.textContent = "Multi-Dish Prep";
      badge.className = "text-xs px-2 py-0.5 rounded bg-cream-300 dark:bg-[#2c2622] text-roasted-muted dark:text-cream-300 font-bold uppercase transition-all";
    }
  }

  if (desc) {
    desc.textContent = isLocked
      ? "Dynamically locks prep steps into a single pot, mug, or skillet. Zero dirty sink pileup!"
      : "Standard multi-dish cooking with cutting board, separate prep bowls, and presentation plates.";
  }

  if (card) {
    if (isLocked) {
      card.classList.add('border-emerald', 'dark:border-emerald/60');
      card.classList.remove('border-roasted', 'dark:border-[#382f2a]');
    } else {
      card.classList.remove('border-emerald', 'dark:border-emerald/60');
      card.classList.add('border-roasted', 'dark:border-[#382f2a]');
    }
  }
}

// Update API Key Status Indicator Dot
function updateApiKeyStatusUI() {
  const dot = document.getElementById('api-status-dot');
  const label = document.getElementById('api-key-label');
  if (!dot || !label || !window.state) return;

  if (window.state.geminiApiKey && window.state.geminiApiKey.trim().length > 10) {
    dot.className = "w-2.5 h-2.5 rounded-full bg-emerald shadow-[0_0_8px_#10b981]";
    label.textContent = window.state.geminiModel ? `Gemini (${window.state.geminiModel.replace('gemini-', '')})` : "Gemini AI Active";
  } else {
    dot.className = "w-2.5 h-2.5 rounded-full bg-sloth-ochre";
    label.textContent = "Offline Sloth AI";
  }
}

// Update Cookbook counter badge
function updateSavedCountBadge() {
  const badge = document.getElementById('saved-recipes-count');
  if (badge && window.state) {
    badge.textContent = window.state.savedRecipes.length;
  }
}

// Apply and Persist Dark/Light Theme with Smooth Icon Animation
function applyTheme(theme) {
  if (window.state) window.state.theme = theme;
  const root = document.documentElement;
  const icon = document.getElementById('theme-icon');
  const iconContainer = document.getElementById('theme-icon-container');

  if (theme === 'dark') {
    root.classList.add('dark');
    if (icon) {
      icon.setAttribute('data-lucide', 'sun');
      icon.classList.remove('text-sloth-amber');
      icon.classList.add('text-sloth-ochre');
    }
  } else {
    root.classList.remove('dark');
    if (icon) {
      icon.setAttribute('data-lucide', 'moon');
      icon.classList.remove('text-sloth-ochre');
      icon.classList.add('text-sloth-amber');
    }
  }

  // Animated icon rotation
  if (iconContainer) {
    iconContainer.classList.add('rotate-180');
    setTimeout(() => iconContainer.classList.remove('rotate-180'), 500);
  }

  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (window.lucide) window.lucide.createIcons();
}

function toggleTheme() {
  const current = (window.state && window.state.theme) || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  if (window.audio) window.audio.playClick();
  showToast(newTheme === 'dark' ? "Switched to Cozy Dark Mode" : "Switched to Creamy Light Mode", newTheme === 'dark' ? "🌙" : "☀️");
}

// Update Audio Sound UI State (Volume-2 vs Volume-X on mute)
function updateSoundUI() {
  const soundIcon = document.getElementById('sound-icon');
  const soundBtn = document.getElementById('toggle-sound-btn');
  if (!soundIcon || !window.state) return;

  if (window.state.soundEnabled) {
    soundIcon.setAttribute('data-lucide', 'volume-2');
    soundIcon.classList.remove('text-rose-500', 'opacity-50');
    soundIcon.classList.add('text-emerald');
    if (soundBtn) {
      soundBtn.title = "Audio Chimes: ON (Click to mute)";
      soundBtn.classList.remove('border-rose-400');
    }
  } else {
    soundIcon.setAttribute('data-lucide', 'volume-x');
    soundIcon.classList.remove('text-emerald');
    soundIcon.classList.add('text-rose-500', 'opacity-50');
    if (soundBtn) {
      soundBtn.title = "Audio Chimes: MUTED (Click to unmute)";
      soundBtn.classList.add('border-rose-400');
    }
  }
  if (window.lucide) window.lucide.createIcons();
}

// Display Toast Message
function showToast(message, icon = "✨") {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove('opacity-0', 'translate-y-24', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-24', 'pointer-events-none');
  }, 2800);
}

// Render Recipe Visualizer Card
function renderRecipeCard(recipe) {
  if (!recipe || !window.state) return;

  const modes = window.ENERGY_MODES || [];
  const mode = modes[window.state.energyMode] || modes[1];
  const isLocked = window.state.minimizeDishes;

  const titleEl = document.getElementById('recipe-title');
  const descEl = document.getElementById('recipe-description');
  const energyTagEl = document.getElementById('recipe-energy-tag');
  const dishTagEl = document.getElementById('recipe-dish-tag');
  const toolBadge = document.getElementById('tool-used-badge');
  const timeSavedEl = document.getElementById('stat-time-saved');
  const dishesSavedEl = document.getElementById('stat-dishes-avoided');
  const ingredientsListEl = document.getElementById('recipe-ingredients-list');
  const stepsListEl = document.getElementById('recipe-steps-list');
  const tipEl = document.getElementById('recipe-tip');

  if (titleEl) titleEl.textContent = recipe.title;
  if (descEl) descEl.textContent = recipe.description;
  if (energyTagEl) energyTagEl.textContent = `${mode.emoji} ${mode.name}`;
  
  if (dishTagEl) {
    dishTagEl.innerHTML = isLocked
      ? `<i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald"></i> 1-Vessel Guaranteed`
      : `<i data-lucide="layers" class="w-3.5 h-3.5 text-sloth-amber"></i> Multi-Dish Prep`;
  }
  
  if (toolBadge) {
    toolBadge.textContent = isLocked 
      ? `Cookware: ${recipe.cookware || (mode.cookware.split('&')[0].trim() + ' (Zero Prep Bowls)')}`
      : `Cookware: Pan + Cutting Board + Prep Bowl + Plate`;
  }

  if (timeSavedEl) {
    timeSavedEl.textContent = isLocked ? (recipe.timeSaved || mode.timeSaved) : "10 mins";
  }

  if (dishesSavedEl) {
    dishesSavedEl.textContent = isLocked ? (recipe.dishesSaved || mode.dishesSaved) : "0 Pans (Multi-Dish)";
  }

  // Render Ingredients
  if (ingredientsListEl && Array.isArray(recipe.ingredients)) {
    ingredientsListEl.innerHTML = recipe.ingredients.map(ing => `
      <span class="px-3.5 py-1.5 rounded-xl text-sm sm:text-base font-semibold bg-cream-100 dark:bg-[#14110f] border-2 border-roasted/30 dark:border-[#382f2a] text-roasted dark:text-cream-100 flex items-center gap-2 shadow-tactile-sm">
        <span class="w-2 h-2 rounded-full bg-emerald"></span>
        <span>${escapeHtml(ing)}</span>
      </span>
    `).join('');
  }

  // Render Step Checklist
  if (stepsListEl && Array.isArray(recipe.steps)) {
    stepsListEl.innerHTML = recipe.steps.map((step, idx) => {
      const stepContent = typeof step === 'string' && step.includes('<span') ? step : escapeHtml(step);
      return `
        <li class="recipe-step-item p-3.5 sm:p-4 rounded-xl bg-cream-100/90 dark:bg-[#14110f] border-2 border-beige dark:border-[#2e2621] hover:border-emerald/60 flex items-start gap-3.5 cursor-pointer select-none text-base sm:text-lg">
          <span class="step-number-circle w-7 h-7 rounded-full bg-cream-300 dark:bg-[#2c2622] border-2 border-roasted dark:border-[#52453e] text-roasted dark:text-cream-100 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
            ${idx + 1}
          </span>
          <span class="step-text leading-relaxed text-roasted dark:text-cream-100 flex-1 font-medium">${stepContent}</span>
        </li>
      `;
    }).join('');

    // Step item interactive strike-through
    stepsListEl.querySelectorAll('.recipe-step-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('step-done');
        if (window.audio) window.audio.playClick();
      });
    });
  }

  // Pro-Tip
  if (tipEl) {
    tipEl.innerHTML = `<strong>Lazy Pro-Tip:</strong> ${escapeHtml(recipe.singleDishTip || "Eat directly from the cooking pan once cooled slightly. Dish count: Exactly 1 item to rinse!")}`;
  }

  // Render Lazy Substitutions & Zero-Store Pantry Swaps
  if (window.LazySubstitutions && typeof window.LazySubstitutions.renderSubstitutionsWidget === 'function') {
    window.LazySubstitutions.renderSubstitutionsWidget(recipe);
  }

  // Sync Sloth Nap Timer with this recipe
  if (window.SlothTimer && typeof window.SlothTimer.syncWithCurrentRecipe === 'function') {
    window.SlothTimer.syncWithCurrentRecipe();
  }

  if (typeof updateBookmarkButtonIcon === 'function') {
    updateBookmarkButtonIcon();
  }

  if (window.lucide) window.lucide.createIcons();
}

// Render Saved Recipes Drawer Modal
function renderSavedRecipesModal() {
  const listEl = document.getElementById('saved-recipes-list');
  if (!listEl || !window.state) return;

  if (window.state.savedRecipes.length === 0) {
    listEl.innerHTML = `
      <div class="py-12 text-center text-xs text-roasted-muted dark:text-cream-300/60">
        <span class="text-3xl block mb-2">📖</span>
        <p class="font-bold text-sm text-roasted dark:text-cream-100">No saved recipes yet</p>
        <p class="mt-1">Click the bookmark icon on any recipe to save it for lazy days.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = window.state.savedRecipes.map((r, idx) => `
    <div class="p-3.5 rounded-xl border-2 border-roasted dark:border-[#382f2a] bg-cream-100 dark:bg-[#14110f] hover:bg-cream-200 dark:hover:bg-[#2c2622] transition-all flex items-start justify-between gap-3">
      <div class="flex-1 cursor-pointer load-saved-recipe" data-index="${idx}">
        <h4 class="font-display font-bold text-base text-roasted dark:text-cream-50 hover:text-emerald dark:hover:text-emerald-light transition-colors">${escapeHtml(r.title)}</h4>
        <p class="text-xs text-roasted-muted dark:text-cream-300/70 mt-0.5 line-clamp-1">${escapeHtml(r.description)}</p>
        <div class="flex items-center gap-3 mt-2 text-xs font-semibold text-emerald-dark dark:text-emerald-light">
          <span>⏱️ ${escapeHtml(r.timeStr)}</span>
          <span>🍳 ${escapeHtml(r.cookware)}</span>
          <span class="text-[10px] text-roasted-muted dark:text-cream-300/50">Saved: ${escapeHtml(r.savedAt || '')}</span>
        </div>
      </div>
      <button type="button" class="delete-saved-recipe p-1.5 text-roasted-muted hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-cream-300 dark:hover:bg-[#382f2a]" data-index="${idx}" title="Delete Recipe">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();

  // Load recipe click handler
  listEl.querySelectorAll('.load-saved-recipe').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      const recipe = window.state.savedRecipes[idx];
      if (recipe) {
        window.state.currentRecipe = recipe;
        renderRecipeCard(recipe);
        document.getElementById('saved-recipes-modal')?.classList.add('hidden');
        showToast(`Loaded ${recipe.title}`, "📖");
        if (window.audio) window.audio.playSlothChime();
      }
    });
  });

  // Delete handler
  listEl.querySelectorAll('.delete-saved-recipe').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      window.state.savedRecipes.splice(idx, 1);
      saveSavedRecipesToStorage();
      updateSavedCountBadge();
      if (typeof updateBookmarkButtonIcon === 'function') updateBookmarkButtonIcon();
      renderSavedRecipesModal();
      if (window.audio) window.audio.playClick();
    });
  });
}

// Setup API Key Modal Controls
function setupApiKeyModal() {
  const openBtn = document.getElementById('open-api-key-modal');
  const closeBtn = document.getElementById('close-api-key-modal');
  const modal = document.getElementById('api-key-modal');
  const input = document.getElementById('api-key-input');
  const toggleVisibility = document.getElementById('toggle-key-visibility');
  const eyeIcon = document.getElementById('eye-icon');
  const saveBtn = document.getElementById('save-api-key-btn');
  const offlineBtn = document.getElementById('use-offline-mode-btn');
  const feedback = document.getElementById('api-test-feedback');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    if (input) input.value = (window.state && window.state.geminiApiKey) || '';
    if (feedback) feedback.classList.add('hidden');
    modal.classList.remove('hidden');
    if (window.audio) window.audio.playClick();
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (window.audio) window.audio.playClick();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Toggle eye visibility
  toggleVisibility?.addEventListener('click', () => {
    if (input.type === 'password') {
      input.type = 'text';
      eyeIcon?.setAttribute('data-lucide', 'eye-off');
    } else {
      input.type = 'password';
      eyeIcon?.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // Save Key & Test
  saveBtn?.addEventListener('click', async () => {
    const key = input.value.trim();
    if (!key) {
      showToast("Please enter an API key or choose Offline Mode", "⚠️");
      return;
    }

    if (feedback) {
      feedback.classList.remove('hidden');
      feedback.className = "text-xs sm:text-sm p-3 rounded-xl border bg-cream-200 dark:bg-[#2c2622] text-roasted dark:text-cream-100 flex items-center gap-2";
      feedback.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-sloth-ochre animate-ping flex-shrink-0"></span> Probing active Gemini models for your Google AI Studio key...`;
    }

    try {
      // Live validation & dynamic model binding
      const verified = await discoverAndValidateGeminiModel(key);

      if (window.state) {
        window.state.geminiApiKey = key;
        window.state.geminiModel = verified.model;
        window.state.geminiApiVersion = verified.apiVersion;
      }

      localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key);
      localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, verified.model);
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_VERSION, verified.apiVersion);

      updateApiKeyStatusUI();
      modal.classList.add('hidden');
      showToast(`Connected! Active model: ${verified.model}`, "✨");
      if (window.audio) window.audio.playSlothChime();
    } catch (err) {
      if (feedback) {
        feedback.className = "text-xs sm:text-sm p-3 rounded-xl border bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 leading-relaxed";
        feedback.innerHTML = `<strong>Verification failed:</strong> ${escapeHtml(err.message)}<br><span class="text-[11px] opacity-80 mt-1 block">Tip: Verify your key at <a href="https://aistudio.google.com/app/apikey" target="_blank" class="underline font-semibold">Google AI Studio</a> or switch to Offline Sloth Mode below.</span>`;
      }
    }
  });

  // Offline Mode Switch
  offlineBtn?.addEventListener('click', () => {
    if (window.state) {
      window.state.geminiApiKey = '';
    }
    localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
    localStorage.removeItem(STORAGE_KEYS.GEMINI_MODEL);
    localStorage.removeItem(STORAGE_KEYS.GEMINI_API_VERSION);
    updateApiKeyStatusUI();
    modal.classList.add('hidden');
    showToast("Switched to Offline Sloth Culinary Simulation", "🦥");
    if (window.audio) window.audio.playClick();
  });
}

// Window bindings
window.escapeHtml = escapeHtml;
window.renderInventoryChips = renderInventoryChips;
window.renderPantryStaples = renderPantryStaples;
window.updateEnergyModeUI = updateEnergyModeUI;
window.updateMinimizeDishesUI = updateMinimizeDishesUI;
window.updateApiKeyStatusUI = updateApiKeyStatusUI;
window.updateSavedCountBadge = updateSavedCountBadge;
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;
window.updateSoundUI = updateSoundUI;
window.showToast = showToast;
window.renderRecipeCard = renderRecipeCard;
window.renderSavedRecipesModal = renderSavedRecipesModal;
window.setupApiKeyModal = setupApiKeyModal;
