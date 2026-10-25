/**
 * Fridge-to-Feast | Recipe Synthesis & Orchestration Engine
 * Coordinates Gemini AI generation and local heuristic simulation
 */

// Deduplicate pure vegetarian inventory items using canonical stems
function getDistinctPureVegItems(inventory) {
  const seenStems = new Set();
  const result = [];
  (inventory || []).forEach(raw => {
    if (typeof isPureVegetarian === 'function' && !isPureVegetarian(raw)) return;
    const stem = typeof getCanonicalStem === 'function' ? getCanonicalStem(raw) : raw.toLowerCase().trim();
    if (!stem || stem.length < 2) return;
    if (!seenStems.has(stem)) {
      seenStems.add(stem);
      const display = raw.replace(/\([^)]*\)/g, '').trim();
      result.push(display);
    }
  });
  return result;
}

// Algorithmic Recipe Synthesizer with Single-Dish Enforcer and Strict Pure Veg Validation
function getAlgorithmicRecipe(activeInventory, energyLevel, minimizeDishes) {
  const db = window.OFFLINE_RECIPES_DATABASE || [];
  const distinctItems = getDistinctPureVegItems(activeInventory);
  const safeItems = distinctItems.length > 0 
    ? distinctItems 
    : ["Tomatoes", "Potatoes", "Onions"];

  // 1. Check if a curated recipe in OFFLINE_RECIPES_DATABASE matches the user's inventory & energy mode
  const matchedDbRecipe = db.find(r => {
    if (r.mode !== energyLevel) return false;
    if (!Array.isArray(r.requiredAny)) return false;
    return r.requiredAny.some(req => {
      const reqStem = typeof getCanonicalStem === 'function' ? getCanonicalStem(req) : req.toLowerCase();
      return safeItems.some(item => {
        const itemStem = typeof getCanonicalStem === 'function' ? getCanonicalStem(item) : item.toLowerCase();
        return itemStem === reqStem || itemStem.includes(reqStem) || reqStem.includes(itemStem);
      });
    });
  });

  if (matchedDbRecipe) {
    return {
      title: matchedDbRecipe.title,
      description: matchedDbRecipe.description,
      cookware: matchedDbRecipe.cookware,
      timeStr: matchedDbRecipe.timeStr,
      timeSaved: matchedDbRecipe.timeSaved,
      dishesSaved: matchedDbRecipe.dishesSaved,
      dishGuarantee: minimizeDishes ? "Guaranteed: 1 Vessel Only" : "Standard Multi-Dish",
      ingredients: Array.from(new Set([...matchedDbRecipe.ingredients])),
      steps: [...matchedDbRecipe.steps],
      singleDishTip: matchedDbRecipe.singleDishTip
    };
  }

  // 2. Procedural Synthesis Fallback: Strictly distinct primary and secondary
  const primary = safeItems[0] || "Vegetables";
  const secondary = (safeItems.length > 1 && safeItems[1] !== primary) ? safeItems[1] : "";
  const featured = secondary ? `${primary} & ${secondary}` : primary;

  const synthesized = {
    title: "",
    description: "",
    cookware: "",
    timeStr: energyLevel === 0 ? "3-5 mins" : (energyLevel === 1 ? "15 mins" : "30 mins"),
    timeSaved: "",
    dishesSaved: "",
    dishGuarantee: "",
    ingredients: [],
    steps: [],
    singleDishTip: ""
  };

  // 3. Ingredients List: Deduplicate and only append staples if missing
  const staples = [];
  const safeStems = safeItems.map(s => typeof getCanonicalStem === 'function' ? getCanonicalStem(s) : s.toLowerCase());
  if (!safeStems.some(s => s.includes('oil') || s.includes('butter') || s.includes('ghee'))) {
    staples.push("1 tbsp Cooking Oil or Butter");
  }
  if (!safeStems.some(s => s.includes('salt'))) {
    staples.push("Pinch of Salt");
  }
  if (!safeStems.some(s => s.includes('cumin') || s.includes('pepper'))) {
    staples.push("Cumin Seeds or Black Pepper");
  }
  synthesized.ingredients = Array.from(new Set([...safeItems, ...staples]));

  // 4. Dynamic Synthesis: Differentiate by Minimize Dishes ON vs OFF across 3 Energy Levels
  if (minimizeDishes) {
    // ================= LOCKED 1-VESSEL COOKING MODE =================
    if (energyLevel === 0) {
      synthesized.title = `3-Minute 1-Mug ${featured} Steam Toss`;
      synthesized.description = `Quick comfort meal prepared, steamed, and eaten directly out of 1 microwave-safe mug. Zero cutting boards, zero prep bowls, zero cleanup pileup!`;
      synthesized.cookware = `1 Microwave Mug & 1 Spoon (Zero Prep Bowls)`;
      synthesized.timeSaved = `35 mins`;
      synthesized.dishesSaved = `4 Pans Avoided`;
      synthesized.dishGuarantee = `Guaranteed: 1 Mug Only (0 Prep Bowls)`;
      synthesized.singleDishTip = `Sloth Hack: Eat directly from the mug with your fork once cooled slightly. Total items to wash: Exactly 1 mug!`;
      synthesized.steps = [
        `🥣 Single-Mug Station: Take 1 heatproof ceramic mug or deep bowl. Leave your cutting board and prep plates in the cupboard.`,
        `🔪 Direct-in-Mug Drop: Roughly tear or hand-slice fresh ${featured} directly over the mug so every piece falls straight inside.`,
        `🧈 Direct Seasoning: Drizzle 1 tsp cooking oil/butter, a pinch of salt, and cumin seeds straight into the mug. Stir once with a fork.`,
        `⚡ Microwave Steam: Microwave on HIGH for 3 minutes until steaming hot, tender, and fragrant.`,
        `🥄 Feast From The Mug: Enjoy straight from the mug with your fork. Congratulations: exactly 1 mug to rinse!`
      ];
    } else if (energyLevel === 1) {
      synthesized.title = `1-Skillet Sizzled ${featured} Toss`;
      synthesized.description = `Golden sautéed ${safeItems.join(', ')} crisped with cumin and mild spices entirely inside 1 skillet. Cook and feast straight from the pan!`;
      synthesized.cookware = `1 Cast-Iron Skillet & 1 Spatula (Zero Prep Bowls)`;
      synthesized.timeSaved = `25 mins`;
      synthesized.dishesSaved = `3 Pans Avoided`;
      synthesized.dishGuarantee = `Guaranteed: 1 Skillet Only (0 Prep Bowls)`;
      synthesized.singleDishTip = `Sloth Pro-Tip: Place the cooled skillet on a trivet and eat straight from the pan. Zero plates to wash!`;
      synthesized.steps = [
        `🍳 1-Skillet Station: Place your skillet on medium heat. Do not dirty a single prep bowl or cutting board.`,
        `🔪 Direct Sizzle: Add 1 tbsp cooking oil and whole cumin. Roughly chop ${featured} directly above the hot skillet so it lands on the sizzling surface.`,
        `🔥 High-Flame Sauté: Sauté for 8-10 minutes, tossing with your spatula until edges turn golden, crisp, and fragrant.`,
        `🧂 Pan Finish: Sprinkle salt, turmeric, and black pepper or chaat masala directly into the skillet, stirring once to coat.`,
        `🍽️ Feast From The Pan: Remove from flame, let rest 1 minute, and enjoy straight from the skillet. Sink dishes: exactly 1 pan!`
      ];
    } else {
      synthesized.title = `Cozy 1-Pot Slow-Simmered ${featured} Stew`;
      synthesized.description = `Tender ${safeItems.join(', ')} simmered gently into an aromatic pure veg broth inside 1 deep pot. Relax while your single pot does all the cooking.`;
      synthesized.cookware = `1 Deep Stew Pot & 1 Ladle (Zero Prep Bowls)`;
      synthesized.timeSaved = `15 mins`;
      synthesized.dishesSaved = `2 Pans Avoided`;
      synthesized.dishGuarantee = `Guaranteed: 1 Pot Only (0 Prep Bowls)`;
      synthesized.singleDishTip = `Sloth Pro-Tip: Eat straight from the pot or a single deep bowl. Total dishes to clean: Exactly 1 pot!`;
      synthesized.steps = [
        `🍲 1-Pot Foundation: Set 1 deep soup pot on medium flame. No extra colanders or cutting dishes required.`,
        `🔪 Direct Pot Drop: Pour in 1 tbsp oil, add spices, and drop in ${safeItems.slice(0, 3).join(' and ')} directly into the pot base.`,
        `💧 Add Broth & Lid: Pour in 1.5 cups water, season generously with salt, stir well, and cover tightly with the lid.`,
        `🦥 Sloth Hands-Free Simmer: Lower flame to gentle low and walk away for 20-25 minutes while the ingredients melt together into a rich comforting stew.`,
        `🥣 Feast From The Pot: Turn off heat, let cool slightly, and enjoy directly from the pot. Exactly 1 cookware item to rinse!`
      ];
    }
  } else {
    // ================= STANDARD MULTI-DISH GOURMET MODE =================
    if (energyLevel === 0) {
      synthesized.title = `Steamed ${featured} with Herb Dressing`;
      synthesized.description = `Uniformly prepped ${safeItems.join(', ')} marinated in a prep bowl, steamed tender in a microwave vessel, and served on a dinner platter.`;
      synthesized.cookware = `Microwave Vessel + Cutting Board + Prep Bowl + Plate`;
      synthesized.timeSaved = `10 mins`;
      synthesized.dishesSaved = `0 Pans (4 Items to Wash)`;
      synthesized.dishGuarantee = `Standard Multi-Dish Prep`;
      synthesized.singleDishTip = `Culinary Tip: Uniform cuts on the cutting board ensure even cooking across all vegetables.`;
      synthesized.steps = [
        `🔪 Cutting Board Station: Place ${featured} on your cutting board and dice into uniform bite-sized pieces.`,
        `🥣 Prep Bowl Mixing: Transfer the diced ingredients into a separate mixing bowl, drizzle with oil, salt, and spices, and toss thoroughly.`,
        `⚡ Microwave Steam: Transfer into a vented microwave dish and steam on HIGH for 3-4 minutes until tender and fragrant.`,
        `🍽️ Plating & Presentation: Spoon onto an aesthetic warm serving plate, garnish with fresh herbs, and serve with side condiments.`
      ];
    } else if (energyLevel === 1) {
      synthesized.title = `Artisanal Sautéed ${featured} Dinner Platter`;
      synthesized.description = `Crispy sautéed ${safeItems.join(', ')} bloomed with spices in a skillet, seasoned in stages, and plated hot on a presentation dish.`;
      synthesized.cookware = `Skillet + Cutting Board + Prep Bowl + Dinner Plate`;
      synthesized.timeSaved = `10 mins`;
      synthesized.dishesSaved = `0 Pans (4 Items to Wash)`;
      synthesized.dishGuarantee = `Standard Multi-Dish Prep`;
      synthesized.singleDishTip = `Culinary Tip: Plating hot on a pre-warmed dinner dish preserves texture and temperature.`;
      synthesized.steps = [
        `🔪 Mise en Place: Set up your cutting board. Finely slice ${featured}, separating ingredients into individual prep bowls.`,
        `🍳 Pan Preheating: Heat 1 tbsp cooking oil in a wide sauté pan until shimmering, then bloom whole cumin and spices.`,
        `🔥 Sauté in Batches: Add the firmer ingredients first, sautéing over medium-high flame for 10-12 minutes until golden and crisp.`,
        `🍽️ Elegant Plating: Transfer the sautéed stir-fry onto a clean dinner plate, season with finishing herbs, and serve.`
      ];
    } else {
      synthesized.title = `Homestyle Slow-Cooked ${featured} Curry Bowl`;
      synthesized.description = `Slow-simmered pure vegetarian curry cooked gently and ladled into presentation dinner bowls.`;
      synthesized.cookware = `Soup Pot + Cutting Board + Prep Bowl + Dinner Bowls`;
      synthesized.timeSaved = `5 mins`;
      synthesized.dishesSaved = `0 Pans (5 Items to Wash)`;
      synthesized.dishGuarantee = `Standard Multi-Dish Prep`;
      synthesized.singleDishTip = `Culinary Tip: Ladling into pre-warmed bowls preserves the aromatic stew broth.`;
      synthesized.steps = [
        `🔪 Prep & Chop: Peel and uniformly chop ${safeItems.slice(0, 3).join(', ')} on a cutting board, arranging in prep bowls.`,
        `🍲 Base Sauté: Heat oil in a heavy pot, sauté whole spices, and gently caramelize the aromatics.`,
        `💧 Simmer to Perfection: Pour in 2 cups vegetable broth, cover with lid, and slow-cook on low flame for 25 minutes.`,
        `🥣 Ladle & Serve: Ladle the finished simmer into presentation serving bowls, top with fresh cilantro, and serve.`
      ];
    }
  }

  return synthesized;
}

// Recipe Generation Orchestration
async function generateRecipe() {
  const loadingOverlay = document.getElementById('recipe-loading-overlay');
  const generateBtn = document.getElementById('generate-recipe-btn');

  if (!window.state || window.state.inventory.length === 0) {
    if (typeof showToast === 'function') {
      showToast("Please add at least one ingredient to your fridge first!", "🧺");
    }
    return;
  }

  if (window.audio) window.audio.playClick();

  // Show loading state
  if (loadingOverlay) loadingOverlay.classList.remove('hidden');
  if (generateBtn) generateBtn.disabled = true;

  try {
    let recipe = null;

    // Use Gemini API if key is present
    if (window.state.geminiApiKey && window.state.geminiApiKey.trim().length > 10) {
      try {
        recipe = await callGeminiRecipeGeneration(
          window.state.inventory,
          window.state.energyMode,
          window.state.minimizeDishes,
          window.state.geminiApiKey
        );
        if (typeof showToast === 'function') {
          showToast("Gemini AI crafted a custom recipe for your ingredients!", "✨");
        }
      } catch (apiErr) {
        console.warn("Gemini Recipe generation note, smoothly using Sloth Engine:", apiErr);
        recipe = getAlgorithmicRecipe(window.state.inventory, window.state.energyMode, window.state.minimizeDishes);
        if (typeof showToast === 'function') {
          showToast("Comfort recipe crafted with Sloth Culinary Engine!", "🦥");
        }
      }
    } else {
      // Local Heuristic Simulation
      await new Promise(res => setTimeout(res, 400));
      recipe = getAlgorithmicRecipe(window.state.inventory, window.state.energyMode, window.state.minimizeDishes);
      if (typeof showToast === 'function') {
        showToast("Generated with Offline Sloth Engine (Add API key for live AI!)", "🦥");
      }
    }

    window.state.currentRecipe = recipe;
    if (typeof renderRecipeCard === 'function') {
      renderRecipeCard(recipe);
    }
    if (window.audio) window.audio.playSlothChime();

    // Scroll smoothly to recipe card on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('recipe-card')?.scrollIntoView({ behavior: 'smooth' });
    }

  } catch (err) {
    console.error("Recipe generation fatal error:", err);
    if (typeof showToast === 'function') {
      showToast("Something went wrong, please try again", "⚠️");
    }
  } finally {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    if (generateBtn) generateBtn.disabled = false;
  }
}

// Check if currently displayed recipe is already bookmarked
function updateBookmarkButtonIcon() {
  const icon = document.getElementById('bookmark-icon');
  if (!icon || !window.state || !window.state.currentRecipe) return;

  const isSaved = window.state.savedRecipes.some(r => r.title === window.state.currentRecipe.title);
  if (isSaved) {
    icon.classList.add('text-emerald', 'fill-emerald');
  } else {
    icon.classList.remove('text-emerald', 'fill-emerald');
  }
}

// Toggle Bookmarking Current Recipe
function toggleBookmarkCurrentRecipe() {
  if (!window.state || !window.state.currentRecipe) {
    if (typeof showToast === 'function') {
      showToast("Generate a recipe first to bookmark it!", "ℹ️");
    }
    return;
  }

  const existingIdx = window.state.savedRecipes.findIndex(r => r.title === window.state.currentRecipe.title);
  if (existingIdx >= 0) {
    window.state.savedRecipes.splice(existingIdx, 1);
    if (typeof showToast === 'function') showToast("Removed recipe from cookbook", "🗑️");
  } else {
    window.state.savedRecipes.unshift({
      ...window.state.currentRecipe,
      savedAt: new Date().toLocaleDateString()
    });
    if (typeof showToast === 'function') showToast("Saved recipe to your cookbook!", "⭐");
  }

  saveSavedRecipesToStorage();
  updateBookmarkButtonIcon();
  if (typeof updateSavedCountBadge === 'function') updateSavedCountBadge();
  if (window.audio) window.audio.playPop();
}

// Copy Recipe as Markdown
function copyRecipeMarkdown() {
  if (!window.state || !window.state.currentRecipe) {
    if (typeof showToast === 'function') showToast("No recipe generated yet!", "ℹ️");
    return;
  }

  const r = window.state.currentRecipe;
  const md = `# ${r.title}
*100% Pure Vegetarian · Time: ${r.timeStr} · ${r.cookware}*

${r.description}

### 🧺 Ingredients:
${(r.ingredients || []).map(i => `- ${i}`).join('\n')}

### 🍳 Minimal-Effort Steps:
${(r.steps || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

**Lazy Pro-Tip:** ${r.singleDishTip || "Eat directly from the pan to avoid washing dishes."}
*Generated by Fridge-to-Feast (Hacktoberfest Week 3 - Slow and Steady)*`;

  navigator.clipboard.writeText(md).then(() => {
    if (typeof showToast === 'function') showToast("Recipe copied as Markdown to clipboard!", "📋");
    if (window.audio) window.audio.playPop();
  }).catch(() => {
    if (typeof showToast === 'function') showToast("Failed to copy recipe", "⚠️");
  });
}

// Window bindings
window.getAlgorithmicRecipe = getAlgorithmicRecipe;
window.getDistinctPureVegItems = getDistinctPureVegItems;
window.generateRecipe = generateRecipe;
window.updateBookmarkButtonIcon = updateBookmarkButtonIcon;
window.toggleBookmarkCurrentRecipe = toggleBookmarkCurrentRecipe;
window.copyRecipeMarkdown = copyRecipeMarkdown;
