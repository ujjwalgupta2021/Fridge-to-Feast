/**
 * Fridge-to-Feast | Root Loader & Entry Point
 * Loads modular components: config, audio, state, recipes, gemini, scanner, ui, app
 */

(function() {
  const modules = [
    'js/config.js',
    'js/audio.js',
    'js/state.js',
    'js/timer.js',
    'js/substitutions.js',
    'js/recipes-data.js',
    'js/recipe-engine.js',
    'js/gemini.js',
    'js/scanner.js',
    'js/ui.js',
    'js/app.js'
  ];

  // If already loaded via script tags, do not duplicate
  if (window.__fridge_to_feast_loaded) return;
  window.__fridge_to_feast_loaded = true;

  // Check if modular scripts are already present in document
  const scripts = Array.from(document.querySelectorAll('script')).map(s => s.getAttribute('src'));
  const needsLoading = modules.filter(m => !scripts.includes(m));

  if (needsLoading.length === 0) {
    return; // All modules explicitly loaded in index.html
  }

  // Sequentially load missing modules
  let index = 0;
  function loadNext() {
    if (index >= needsLoading.length) return;
    const script = document.createElement('script');
    script.src = needsLoading[index];
    script.onload = () => {
      index++;
      loadNext();
    };
    document.head.appendChild(script);
  }
  loadNext();
})();
