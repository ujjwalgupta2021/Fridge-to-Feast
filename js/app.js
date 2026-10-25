/**
 * Fridge-to-Feast | Main Application Orchestrator
 * Bootstraps modular subsystems and binds user interaction events
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load saved state from localStorage
  loadStateFromStorage();

  // 2. Render initial dynamic UI
  renderInventoryChips();
  renderPantryStaples();
  updateEnergyModeUI();
  updateMinimizeDishesUI();
  updateApiKeyStatusUI();
  updateSavedCountBadge();
  updateSoundUI();
  if (window.SlothTimer) SlothTimer.init();
  if (window.LazySubstitutions) LazySubstitutions.setupModalEvents();

  // 3. Dark Mode Toggle Button Listener
  const themeBtn = document.getElementById('toggle-theme-btn');
  themeBtn?.addEventListener('click', toggleTheme);

  // 4. Setup Image Dropzone
  setupImageDropzone();

  // 5. Setup Google AI Studio API Key Modal
  setupApiKeyModal();

  // 6. Text Intake Form Submission
  const textForm = document.getElementById('text-intake-form');
  const textInput = document.getElementById('text-ingredient-input');
  textForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (textInput && textInput.value) {
      addSingleOrBulkIngredients(textInput.value);
      textInput.value = '';
    }
  });

  // 7. Inventory Controls
  document.getElementById('clear-inventory-btn')?.addEventListener('click', clearAllInventory);
  document.getElementById('restore-defaults-btn')?.addEventListener('click', restoreDefaultInventory);

  // 8. Cooking Energy Slider & Ticks
  const slider = document.getElementById('energy-slider');
  slider?.addEventListener('input', (e) => {
    if (window.state) {
      window.state.energyMode = parseInt(e.target.value, 10);
      updateEnergyModeUI();
      if (window.SlothTimer) SlothTimer.syncWithCurrentRecipe();
      if (window.audio) window.audio.playClick();
    }
  });

  document.querySelectorAll('.energy-tick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (window.state) {
        window.state.energyMode = idx;
        updateEnergyModeUI();
        if (window.SlothTimer) SlothTimer.syncWithCurrentRecipe();
        if (window.audio) window.audio.playClick();
      }
    });
  });

  // 9. Minimize Dishes Toggle
  const dishesToggle = document.getElementById('minimize-dishes-toggle');
  if (dishesToggle && window.state) {
    dishesToggle.checked = window.state.minimizeDishes;
    dishesToggle.addEventListener('change', (e) => {
      window.state.minimizeDishes = e.target.checked;
      localStorage.setItem(STORAGE_KEYS.MINIMIZE_DISHES, JSON.stringify(window.state.minimizeDishes));
      if (typeof updateMinimizeDishesUI === 'function') updateMinimizeDishesUI();
      if (window.audio) window.audio.playClick();
      showToast(window.state.minimizeDishes ? "Locked preparation to 1 dish only!" : "Standard prep mode enabled", "🍳");
      
      // If recipe is displayed, re-run single dish modifications
      if (window.state.currentRecipe) {
        window.state.currentRecipe = getAlgorithmicRecipe(window.state.inventory, window.state.energyMode, window.state.minimizeDishes);
        renderRecipeCard(window.state.currentRecipe);
      }
    });
  }

  // 10. Generate Recipe Button
  document.getElementById('generate-recipe-btn')?.addEventListener('click', generateRecipe);

  // 11. Bookmark Recipe Button
  document.getElementById('bookmark-recipe-btn')?.addEventListener('click', toggleBookmarkCurrentRecipe);

  // 12. Copy Recipe Button
  document.getElementById('copy-recipe-btn')?.addEventListener('click', copyRecipeMarkdown);

  // 13. Saved Recipes Modal
  const savedModal = document.getElementById('saved-recipes-modal');
  document.getElementById('open-saved-modal')?.addEventListener('click', () => {
    renderSavedRecipesModal();
    savedModal?.classList.remove('hidden');
    if (window.audio) window.audio.playClick();
  });

  document.getElementById('close-saved-modal')?.addEventListener('click', () => {
    savedModal?.classList.add('hidden');
    if (window.audio) window.audio.playClick();
  });

  savedModal?.addEventListener('click', (e) => {
    if (e.target === savedModal) savedModal.classList.add('hidden');
  });

  // 14. Sound Toggle Button
  const soundBtn = document.getElementById('toggle-sound-btn');
  soundBtn?.addEventListener('click', () => {
    if (window.state) {
      window.state.soundEnabled = !window.state.soundEnabled;
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(window.state.soundEnabled));
      updateSoundUI();
      if (window.state.soundEnabled && window.audio) {
        window.audio.playPop();
      }
      showToast(window.state.soundEnabled ? "Audio chimes unmuted (Full Volume)" : "Audio chimes muted", window.state.soundEnabled ? "🔊" : "🔇");
    }
  });

  // 15. Preload Initial Pure-Veg Recipe Simulation
  if (window.state) {
    window.state.currentRecipe = getAlgorithmicRecipe(window.state.inventory, window.state.energyMode, window.state.minimizeDishes);
    renderRecipeCard(window.state.currentRecipe);
  }
});
