/**
 * Fridge-to-Feast | Google AI Studio Gemini API Integration
 * Multi-tier Gemini Flash fallback chain, live ping probe, and vision/text generation
 */

// Bulletproof Hierarchical Gemini Model Fallback Cascade
// Exclusively Gemini Flash models first (multimodal, fast, structured JSON mode), then Pro as fallback
const GEMINI_MODEL_CASCADE = [
  { model: 'gemini-1.5-flash-latest', apiVersion: 'v1beta', isFlash: true },
  { model: 'gemini-1.5-flash', apiVersion: 'v1', isFlash: true },
  { model: 'gemini-1.5-flash-002', apiVersion: 'v1beta', isFlash: true },
  { model: 'gemini-1.5-flash-001', apiVersion: 'v1beta', isFlash: true },
  { model: 'gemini-1.5-flash-8b', apiVersion: 'v1beta', isFlash: true },
  { model: 'gemini-2.0-flash-exp', apiVersion: 'v1beta', isFlash: true },
  { model: 'gemini-1.5-pro-latest', apiVersion: 'v1beta', isFlash: false },
  { model: 'gemini-1.5-pro', apiVersion: 'v1', isFlash: false }
];

// Helper: Strictly ensure a model is a genuine Gemini model and NEVER Gemma or embedding/legacy
function isSafeGeminiModel(name) {
  if (!name || typeof name !== 'string') return false;
  const lower = name.toLowerCase().replace(/^models\//, '');
  // Must start with 'gemini-' and strictly EXCLUDE 'gemma', 'bison', 'gecko', 'embedding', 'aqa'
  return lower.startsWith('gemini-') &&
         !lower.includes('gemma') &&
         !lower.includes('embedding') &&
         !lower.includes('bison') &&
         !lower.includes('gecko') &&
         !lower.includes('aqa');
}

// Bulletproof Dynamic Model Discovery & Live Verification
async function discoverAndValidateGeminiModel(apiKey) {
  let liveDiscoveredGemini = [];

  // 1. Query Google AI Studio ListModels to see what Gemini models Google reports
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const resp = await fetch(listUrl);
    if (resp.ok) {
      const data = await resp.json();
      const models = data?.models || [];
      liveDiscoveredGemini = models
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace(/^models\//, ''))
        .filter(name => isSafeGeminiModel(name));
      console.log("[Gemini Discovery] Live Google AI Studio Gemini models:", liveDiscoveredGemini);
    }
  } catch (e) {
    console.warn("ListModels query note, proceeding with prioritized Flash cascade:", e);
  }

  // 2. Build Probe Queue Prioritized Exclusively with Gemini Flash
  const probeQueue = [];

  // Priority 1: Verified Flash Cascade models
  for (const item of GEMINI_MODEL_CASCADE) {
    if (!probeQueue.some(p => p.model === item.model && p.apiVersion === item.apiVersion)) {
      probeQueue.push(item);
    }
  }

  // Priority 2: Any additional safe Gemini models reported by ListModels
  for (const m of liveDiscoveredGemini) {
    if (!probeQueue.some(p => p.model === m)) {
      probeQueue.push({ model: m, apiVersion: 'v1beta' });
    }
  }

  let lastError = null;

  // 3. Probe the candidate models in priority order with a lightweight ping
  for (const candidate of probeQueue) {
    try {
      const testUrl = `https://generativelanguage.googleapis.com/${candidate.apiVersion}/models/${encodeURIComponent(candidate.model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const testResp = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
      });

      if (testResp.ok) {
        console.log(`[Gemini Discovery] Verified active model: ${candidate.model} via ${candidate.apiVersion}`);
        return { model: candidate.model, apiVersion: candidate.apiVersion };
      } else {
        const errData = await testResp.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${testResp.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || "No working Gemini Flash model could be verified. Please check your key or use Offline Mode.");
}

// Helper: Sanitize and clean ingredient strings (strips brackets, uncertainty words, packaging, conversational phrases)
function cleanIngredientName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  
  // 1. Remove markdown bullets and numbering prefixes
  let clean = raw.replace(/^[-*•#0-9.)\s]+/, '');

  // 2. Reject conversational sentences or descriptive headers
  if (/\b(here are|i can see|looks like|in this photo|in this image|there are|visible in|detected|we have|you have|following items|photo shows|picture shows|based on|ingredients shown|shelf contains)\b/i.test(clean)) {
    return '';
  }

  // 3. Remove anything in parentheses, square brackets, or curly braces
  clean = clean
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\{[^}]*\)/g, ' ');

  // 4. Remove symbols and punctuation
  clean = clean.replace(/[?!*#~`"';:+=_\\/|<>@$%^&]/g, ' ');

  // 5. Remove uncertainty & guess words
  clean = clean.replace(/\b(maybe|possibly|probably|likely|unknown|unidentified|unclear|looks like|could be|optional)\b/gi, ' ');

  // 6. Remove packaging, containers, and shelves
  clean = clean.replace(/\b(bottle of|bottled|carton of|jar of|can of|canned|box of|packet of|bag of|package of|pack of|package|carton|bottle|jar|shelf|tray|drawer|plastic|container|wrapper)\b/gi, ' ');

  // 7. Remove unnecessary preparation adjectives and quantity words
  clean = clean.replace(/\b(sliced|diced|chopped|fresh|raw|cooked|leftover|some|various|unopened|opened|bunch of|handful of|piece of|pieces of|cloves of|clove of|stalks of)\b/gi, ' ');

  // 8. Clean whitespace
  clean = clean.trim().replace(/\s+/g, ' ');

  // 9. Filter out non-food generic words or too short/long strings
  const lower = clean.toLowerCase();
  const banned = ['food', 'ingredient', 'vegetable', 'vegetables', 'item', 'items', 'stuff', 'thing', 'things', 'fridge', 'shelf', 'sauce', 'condiment', 'counter', 'kitchen', 'plate', 'bowl', 'dish'];
  if (clean.length < 2 || clean.length > 25 || banned.includes(lower)) {
    return '';
  }

  // 10. STRICT PURE VEGETARIAN FILTER
  if (typeof isPureVegetarian === 'function' && !isPureVegetarian(clean)) {
    return '';
  }

  // 11. Title Case
  return clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Call Google AI Studio Gemini Multimodal Vision API
// Universal extractor for vision results across all Gemini response structures
function extractIngredientsList(data, rawText) {
  const list = [];

  function addClean(val) {
    if (!val || typeof val !== 'string') return;
    const cleaned = cleanIngredientName(val);
    if (cleaned && !list.includes(cleaned)) {
      list.push(cleaned);
    }
  }

  function traverse(obj) {
    if (!obj) return;
    if (typeof obj === 'string') {
      addClean(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (typeof obj === 'object') {
      if (typeof obj.name === 'string') addClean(obj.name);
      else if (typeof obj.ingredient === 'string') addClean(obj.ingredient);
      else if (typeof obj.item === 'string') addClean(obj.item);
      else if (typeof obj.label === 'string') addClean(obj.label);
      else {
        Object.values(obj).forEach(traverse);
      }
    }
  }

  // 1. Traverse parsed JSON if available
  if (data) {
    traverse(data);
  }

  // 2. If JSON traversal didn't find items, parse raw text lines or quoted items
  if (list.length === 0 && rawText) {
    // Check for quoted strings: ["Carrot", "Spinach"] or "Carrot", "Spinach"
    const quotes = rawText.match(/["']([a-zA-Z\s]{2,25})["']/g);
    if (quotes && quotes.length > 0) {
      quotes.forEach(q => addClean(q.replace(/["']/g, '')));
    }

    // Check line by line (e.g. bullets: "- Spinach", "1. Carrots", "* Tomatoes")
    if (list.length === 0) {
      const lines = rawText.split('\n');
      for (const line of lines) {
        const stripped = line.replace(/^[-*•0-9.)\s]+/, '').replace(/["',]/g, '').trim();
        addClean(stripped);
      }
    }
  }

  return list;
}

// Call Google AI Studio Gemini Multimodal Vision API with multi-model fallback and payload resilience
async function callGeminiVisionScan(base64WithHeader, mimeType, apiKey) {
  // Extract pure base64 data and mime type
  let base64Data = base64WithHeader;
  let resolvedMime = mimeType || "image/jpeg";

  if (base64WithHeader.includes(',')) {
    const parts = base64WithHeader.split(',');
    base64Data = parts[1];
    const headerMatch = parts[0].match(/data:([^;]+);base64/);
    if (headerMatch && headerMatch[1]) {
      resolvedMime = headerMatch[1];
    }
  }
  base64Data = (base64Data || '').trim().replace(/[\r\n\s]+/g, '');

  // Vision-capable model priority list (exclusively safe Gemini Flash/Pro, strictly NO Gemma)
  const visionCandidates = [];
  if (window.state && isSafeGeminiModel(window.state.geminiModel)) {
    visionCandidates.push({
      model: window.state.geminiModel,
      apiVersion: window.state.geminiApiVersion || 'v1beta'
    });
  }

  for (const item of GEMINI_MODEL_CASCADE) {
    if (!visionCandidates.some(c => c.model === item.model && c.apiVersion === item.apiVersion)) {
      visionCandidates.push(item);
    }
  }

  const prompt = `CRITICAL: 100% PURE VEGETARIAN ONLY. Identify ONLY edible vegetarian vegetables, fruits, herbs, and cooking ingredients visible in this image.
Do NOT include meat, poultry, seafood, fish, eggs, or non-veg items.
List each vegetarian ingredient name clearly (e.g., Tomato, Onion, Potato, Spinach, Bell Pepper, Carrot, Lemon, Garlic, Ginger, Paneer, Mushroom, Peas).
Return ONLY a valid JSON array of individual strings, for example: ["Tomato", "Spinach", "Potato", "Onion"].`;

  let lastError = null;

  for (const candidate of visionCandidates) {
    // Try both v1beta and v1 if needed
    const apiVersionsToTry = [candidate.apiVersion];
    if (candidate.apiVersion === 'v1beta') apiVersionsToTry.push('v1');
    else if (candidate.apiVersion === 'v1') apiVersionsToTry.push('v1beta');

    for (const apiVer of apiVersionsToTry) {
      const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${encodeURIComponent(candidate.model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      // Attempt 1: Standard camelCase inlineData with role: "user"
      const requestBodyCamel = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: resolvedMime,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 800
        }
      };

      try {
        let response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBodyCamel)
        });

        // Attempt 2: If 400 error mentioning inlineData, retry with snake_case inline_data
        if (!response.ok && response.status === 400) {
          const errCheck = await response.clone().json().catch(() => ({}));
          const errMsg = errCheck?.error?.message || '';
          if (errMsg.includes('inlineData') || errMsg.includes('Cannot find field')) {
            const requestBodySnake = {
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: prompt },
                    {
                      inline_data: {
                        mime_type: resolvedMime,
                        data: base64Data
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 800
              }
            };

            response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBodySnake)
            });
          }
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = new Error(errData?.error?.message || `HTTP ${response.status}`);
          continue; // Try next api version or model
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const rawText = parts.map(p => p.text || '').join('\n').trim();
        console.log(`[Gemini Vision] Successfully extracted from ${candidate.model} (${apiVer}):`, rawText);

        // Parse JSON if possible
        let parsed = null;
        try {
          const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            parsed = JSON.parse(cleaned);
          }
        } catch (e) {
          parsed = null;
        }

        const extracted = extractIngredientsList(parsed, rawText);
        if (extracted.length > 0) {
          // Save responsive vision model to state
          if (window.state && (window.state.geminiModel !== candidate.model || window.state.geminiApiVersion !== apiVer)) {
            window.state.geminiModel = candidate.model;
            window.state.geminiApiVersion = apiVer;
            localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, candidate.model);
            localStorage.setItem(STORAGE_KEYS.GEMINI_API_VERSION, apiVer);
            if (typeof updateApiKeyStatusUI === 'function') updateApiKeyStatusUI();
          }
          return extracted;
        }
      } catch (err) {
        lastError = err;
      }
    }
  }

  throw lastError || new Error("Could not detect ingredients from photo. Please verify your Gemini API key.");
}

// Bulletproof Parser for Gemini Recipe Responses
// Extracts recipes from pure JSON, markdown fences, preambles, or bulleted text
function robustParseRecipeJSON(rawText, fallbackRecipe) {
  if (!rawText || typeof rawText !== 'string') return fallbackRecipe;

  // Clean common markdown fences and leading/trailing whitespace
  let cleaned = rawText
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/im, '')
    .trim();

  // Strategy 1: Extract first complete { ... } JSON block (ignores preambles like '* Role: ...')
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && (parsed.title || Array.isArray(parsed.ingredients) || Array.isArray(parsed.steps))) {
        return sanitizeParsedRecipe(parsed, fallbackRecipe);
      }
    } catch (e) {
      // Fall through to auto-close repair
    }
  }

  // Strategy 2: If there's an opening '{', attempt auto-closing truncated JSON
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace !== -1) {
    let sub = cleaned.substring(firstBrace);
    const openCurly = (sub.match(/\{/g) || []).length;
    const closeCurly = (sub.match(/\}/g) || []).length;
    const openSquare = (sub.match(/\[/g) || []).length;
    const closeSquare = (sub.match(/\]/g) || []).length;

    if (openSquare > closeSquare) sub += '"]'.repeat(openSquare - closeSquare);
    if (openCurly > closeCurly) sub += '}'.repeat(openCurly - closeCurly);

    try {
      const parsed = JSON.parse(sub);
      if (parsed && (parsed.title || Array.isArray(parsed.ingredients))) {
        return sanitizeParsedRecipe(parsed, fallbackRecipe);
      }
    } catch (e) {}
  }

  // Strategy 3: Regex Field Extraction (handles bullet points like "* Title:", "* Steps:")
  try {
    const extracted = { ...fallbackRecipe };

    const titleMatch = cleaned.match(/(?:["']?title["']?\s*:\s*["']?|^\s*[*•-]?\s*Title:\s*)([^\n",}]+)/im);
    if (titleMatch && titleMatch[1]) {
      extracted.title = titleMatch[1].replace(/[()[\]{}"*]/g, '').trim();
    }

    const descMatch = cleaned.match(/(?:["']?description["']?\s*:\s*["']?|^\s*[*•-]?\s*Description:\s*)([^\n"}]+)/im);
    if (descMatch && descMatch[1]) {
      extracted.description = descMatch[1].replace(/[()[\]{}"*]/g, '').trim();
    }

    const ingArrayMatch = cleaned.match(/["']?ingredients["']?\s*:\s*\[([\s\S]*?)\]/i);
    if (ingArrayMatch && ingArrayMatch[1]) {
      const items = ingArrayMatch[1]
        .split(/[,;\n]+/)
        .map(i => i.replace(/[()[\]{}"*]/g, '').trim())
        .filter(i => i.length > 2);
      if (items.length > 0) extracted.ingredients = items;
    }

    const stepsArrayMatch = cleaned.match(/["']?steps["']?\s*:\s*\[([\s\S]*?)\]/i);
    if (stepsArrayMatch && stepsArrayMatch[1]) {
      const stepItems = stepsArrayMatch[1]
        .split(/(?:",\s*"|",\n\s*"|\n\s*")/g)
        .map(s => s.replace(/[()[\]{}"*]/g, '').trim())
        .filter(s => s.length > 5);
      if (stepItems.length > 0) extracted.steps = stepItems;
    }

    if (extracted.title && extracted.steps && extracted.steps.length > 0) {
      return sanitizeParsedRecipe(extracted, fallbackRecipe);
    }
  } catch (e) {}

  return fallbackRecipe;
}

function sanitizeParsedRecipe(parsed, fallback) {
  const recipe = { ...fallback, ...parsed };

  if (recipe.title) {
    recipe.title = recipe.title.replace(/[()[\]{}"*]/g, '').trim();
  } else {
    recipe.title = fallback.title;
  }

  if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
    recipe.ingredients = recipe.ingredients
      .map(i => (typeof i === 'string' ? i.replace(/[()[\]{}"*]/g, '').trim() : ''))
      .filter(i => i.length > 1 && (typeof isPureVegetarian === 'function' ? isPureVegetarian(i) : true));
    if (recipe.ingredients.length === 0) recipe.ingredients = fallback.ingredients;
  } else {
    recipe.ingredients = fallback.ingredients;
  }

  if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
    recipe.steps = recipe.steps
      .map(s => (typeof s === 'string' ? s.replace(/[()[\]{}"*]/g, '').trim() : ''))
      .filter(s => s.length > 5);
    if (recipe.steps.length === 0) recipe.steps = fallback.steps;
  } else {
    recipe.steps = fallback.steps;
  }

  return recipe;
}

// Gemini AI Recipe Generator with Multi-Tier Cascading Fallback
async function callGeminiRecipeGeneration(inventory, energyModeIndex, minimizeDishes, apiKey) {
  const modes = window.ENERGY_MODES || [];
  const mode = modes[energyModeIndex] || modes[1];

  // Default fallback recipe ready in case of complete API outage or offline usage
  const defaultFallback = typeof getAlgorithmicRecipe === 'function'
    ? getAlgorithmicRecipe(inventory, energyModeIndex, minimizeDishes)
    : {
        title: "Quick Vegetarian Toss",
        description: "Effortless pure vegetarian comfort dish.",
        cookware: minimizeDishes ? "1 Skillet (Zero Prep Bowls)" : "Pan + Board + Bowl + Plate",
        timeStr: mode.timeStr,
        timeSaved: minimizeDishes ? mode.timeSaved : "10 mins",
        dishesSaved: minimizeDishes ? mode.dishesSaved : "0 Pans",
        ingredients: inventory || ["Tomatoes", "Potatoes"],
        steps: ["Heat cookware with oil.", "Add vegetables and seasonings.", "Cook until tender and enjoy."],
        singleDishTip: "Eat straight from the cooking vessel."
      };

  // Clean the inventory list to ensure strictly pure vegetarian items
  const cleanInventory = (inventory || [])
    .filter(i => (typeof isPureVegetarian === 'function' ? isPureVegetarian(i) : true))
    .map(i => cleanIngredientName(i) || i.trim())
    .filter(i => i.length > 0);

  const safeList = cleanInventory.length > 0 ? cleanInventory : ["Tomatoes", "Potatoes", "Onions"];

  const prompt = `Return ONLY a valid JSON object matching the schema below. Do NOT write any introduction, bullet points, asterisks, or markdown.
You are a pure vegetarian chef creating a comforting, effortless recipe.
Available vegetarian ingredients: ${JSON.stringify(safeList)}.

CRITICAL RULES:
1. STRICT 100% PURE VEGETARIAN: Absolutely NO meat, chicken, pork, beef, fish, seafood, eggs, gelatin, or animal broths. Even if non-veg items are mentioned, completely exclude them.
2. ONLY USE THE SHOWN INGREDIENTS LISTED ABOVE. Do NOT invent unrelated vegetables. You may only assume universal basic seasonings (cooking oil or butter, salt, black pepper or cumin, water).
3. Create ONE delicious, cohesive dish made out of the user's shown items.
4. Absolutely NO brackets, parentheses, or symbols in the text (do NOT write "(optional)", "(approx amount)", or "[diced]").
5. Under "ingredients", write clean item lines with simple everyday quantities (e.g., "2 Tomatoes", "1 cup Cooked Rice", "1 tbsp Olive Oil", "Pinch of Salt").
6. Cooking Energy Level: ${mode.name} (Target Time: ${mode.timeStr}).
7. Minimize Dishes Constraint: ${
    minimizeDishes
      ? "LOCKED 1-VESSEL COOKING: Cook and eat directly out of 1 single pot, mug, or skillet. Zero cutting boards, zero prep bowls, zero extra plates. Steps must instruct dropping ingredients directly into the cooking vessel and eating directly from it."
      : "STANDARD MULTI-DISH COOKING: Standard gourmet preparation using a cutting board, separate mixing bowl, cooking in a pan, and transferring onto a clean dinner plate."
  }

JSON Schema:
{
  "title": "Clean Creative Dish Name Using Shown Items",
  "description": "Appetizing 1-2 sentence description highlighting comfort and laziness.",
  "cookware": "${minimizeDishes ? ('1 ' + (mode.cookware.split('&')[0].trim()) + ' (Zero Prep Bowls)') : 'Pan + Board + Prep Bowl + Plate'}",
  "timeStr": "${mode.timeStr}",
  "timeSaved": "${minimizeDishes ? mode.timeSaved : '10 mins'}",
  "dishesSaved": "${minimizeDishes ? mode.dishesSaved : '0 Pans (Multi-Dish Prep)'}",
  "ingredients": [
    "Clean item 1 with quantity",
    "Clean item 2 with quantity",
    "1 tbsp Cooking Oil",
    "Pinch of Salt"
  ],
  "steps": [
    "Step 1 description",
    "Step 2 description",
    "Step 3 description",
    "Step 4 description"
  ],
  "singleDishTip": "${minimizeDishes ? 'Eat directly from the pan or mug with 1 fork. Total cleanup: exactly 1 item to rinse!' : 'Use a cutting board for uniform dice and plate hot on a dinner dish.'}"
}`;

  // Build the cascading fallback queue:
  // Starts with currently selected model (if safe), followed by the rest of the Gemini Flash cascade
  const cascadeQueue = [];
  if (window.state && isSafeGeminiModel(window.state.geminiModel)) {
    cascadeQueue.push({
      model: window.state.geminiModel,
      apiVersion: window.state.geminiApiVersion || 'v1beta'
    });
  }
  for (const item of GEMINI_MODEL_CASCADE) {
    if (!cascadeQueue.some(c => c.model === item.model && c.apiVersion === item.apiVersion)) {
      cascadeQueue.push(item);
    }
  }

  let lastError = null;

  for (const candidate of cascadeQueue) {
    const url = `https://generativelanguage.googleapis.com/${candidate.apiVersion}/models/${encodeURIComponent(candidate.model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1500,
        responseMimeType: "application/json"
      }
    };

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      // If 400 error due to responseMimeType on older model, retry without it
      if (!response.ok && response.status === 400) {
        const errCheck = await response.clone().json().catch(() => ({}));
        if (errCheck?.error?.message?.includes('responseMimeType')) {
          delete requestBody.generationConfig.responseMimeType;
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status}`;
        lastError = new Error(errMsg);
        console.warn(`[Gemini Cascade] ${candidate.model} (${candidate.apiVersion}) returned error: ${errMsg}. Cascading to next Gemini Flash model...`);
        continue; // Cascade to next model in chain!
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const rawText = parts.map(p => p.text || '').join('\n').trim();

      if (!rawText) {
        lastError = new Error("Empty response received");
        continue;
      }

      // Parse using our resilient multi-strategy parser
      const recipe = robustParseRecipeJSON(rawText, defaultFallback);

      // Successfully generated! Update state and localStorage to this responsive model
      if (window.state && (window.state.geminiModel !== candidate.model || window.state.geminiApiVersion !== candidate.apiVersion)) {
        window.state.geminiModel = candidate.model;
        window.state.geminiApiVersion = candidate.apiVersion;
        localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, candidate.model);
        localStorage.setItem(STORAGE_KEYS.GEMINI_API_VERSION, candidate.apiVersion);
        if (typeof updateApiKeyStatusUI === 'function') updateApiKeyStatusUI();
      }

      return recipe;
    } catch (netErr) {
      lastError = netErr;
      console.warn(`[Gemini Cascade] Network error on ${candidate.model}:`, netErr);
    }
  }

  console.warn("All Gemini Flash cascade models failed or unavailable. Smoothly engaging Offline Sloth Engine:", lastError);
  return defaultFallback;
}

// Gemini AI Recipe Rephraser for Substituted Ingredients
async function callGeminiRephraseRecipeWithSwaps(baseRecipe, activeSwaps, apiKey) {
  if (!baseRecipe || !activeSwaps || Object.keys(activeSwaps).length === 0) {
    return baseRecipe;
  }

  const swapDescriptions = Object.entries(activeSwaps).map(([key, info]) => {
    return `- Replace "${info.originalName}" with "${info.swapName}" (${info.swapNote || 'pure veg pantry alternative'})`;
  }).join('\n');

  const prompt = `Return ONLY a valid JSON object matching the schema below. Do NOT write any introduction, commentary, asterisks, or markdown fences.
You are a master pure vegetarian chef. The home cook is swapping ingredients in this recipe with pantry alternatives.
Your job is to rephrase and adapt the cooking instructions, recipe title, and ingredients so the recipe makes complete culinary sense with the new swapped ingredient(s).

ORIGINAL RECIPE:
Title: ${baseRecipe.title}
Description: ${baseRecipe.description}
Cookware: ${baseRecipe.cookware || '1 Skillet'}
Time: ${baseRecipe.timeStr || '15 mins'}
Ingredients:
${(baseRecipe.ingredients || []).map(i => '- ' + i).join('\n')}

Steps:
${(baseRecipe.steps || []).map((s, idx) => (idx + 1) + '. ' + s).join('\n')}

SWAPPED INGREDIENTS TO INTEGRATE:
${swapDescriptions}

CRITICAL RULES:
1. STRICT 100% PURE VEGETARIAN: Absolutely NO meat, chicken, pork, fish, seafood, eggs, gelatin, or animal broths.
2. REPHRASE INSTRUCTIONS CULINARILY:
   - Adapt the actual cooking actions to match how the swapped item behaves in a pan!
     (e.g., if paneer is replaced by boiled chickpeas, don't say "slice chickpeas into cubes"; say "drain and toss boiled chickpeas directly into the pan to coat with sizzling spices").
     (e.g., if tomatoes are replaced by lemon juice, don't sauté lemon juice in hot oil; drizzle lemon juice with a pinch of sugar near the end for bright citrus balance).
     (e.g., if capsicum is replaced by carrot batons, sauté crisp carrot batons for sweet, colorful crunch).
     (e.g., if rice is replaced by torn rotis, tear rotis into bite-sized noodles and toss in the hot pan sauce).
     (e.g., if coriander is replaced by dried kasuri methi, crush kasuri methi between dry palms and sprinkle on top).
   - Maintain approximately ${baseRecipe.steps?.length || 4} steps with natural, cohesive phrasing.
   - Zero repetitive words, zero clumsy text splicing.
3. Update the recipe title to celebrate the new swapped item(s).
4. Update the ingredients list to cleanly show the new swapped items.
5. In each step where a swapped ingredient is used, prefix the step with "[Swap: NewIngredient]" (e.g. "[Swap: Tofu] Sauté golden tofu cubes...").
6. Absolutely NO brackets or parentheses in the output except the "[Swap: Name]" prefix.

JSON Schema:
{
  "title": "Natural Dish Name Featuring Swapped Items",
  "description": "Appetizing 1-2 sentence description highlighting the adapted flavors.",
  "cookware": "${baseRecipe.cookware || '1 Skillet'}",
  "timeStr": "${baseRecipe.timeStr || '15 mins'}",
  "timeSaved": "${baseRecipe.timeSaved || '25 mins'}",
  "dishesSaved": "${baseRecipe.dishesSaved || '3 Pans'}",
  "ingredients": [
    "Item 1 with quantity",
    "Item 2 with quantity"
  ],
  "steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "singleDishTip": "Helpful 1-sentence lazy cooking tip on the swapped ingredients."
}`;

  const cascadeQueue = [];
  if (window.state && isSafeGeminiModel(window.state.geminiModel)) {
    cascadeQueue.push({
      model: window.state.geminiModel,
      apiVersion: window.state.geminiApiVersion || 'v1beta'
    });
  }
  for (const item of GEMINI_MODEL_CASCADE) {
    if (!cascadeQueue.some(c => c.model === item.model && c.apiVersion === item.apiVersion)) {
      cascadeQueue.push(item);
    }
  }

  let lastError = null;

  for (const candidate of cascadeQueue) {
    const url = `https://generativelanguage.googleapis.com/${candidate.apiVersion}/models/${encodeURIComponent(candidate.model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500,
        responseMimeType: "application/json"
      }
    };

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok && response.status === 400) {
        const errCheck = await response.clone().json().catch(() => ({}));
        if (errCheck?.error?.message?.includes('responseMimeType')) {
          delete requestBody.generationConfig.responseMimeType;
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status}`;
        lastError = new Error(errMsg);
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const rawText = parts.map(p => p.text || '').join('\n').trim();

      if (!rawText) continue;

      const recipe = robustParseRecipeJSON(rawText, baseRecipe);
      return recipe;
    } catch (netErr) {
      lastError = netErr;
    }
  }

  throw lastError || new Error("Failed to rephrase recipe with Gemini AI");
}

// Window bindings
window.discoverAndValidateGeminiModel = discoverAndValidateGeminiModel;
window.callGeminiVisionScan = callGeminiVisionScan;
window.callGeminiRecipeGeneration = callGeminiRecipeGeneration;
window.callGeminiRephraseRecipeWithSwaps = callGeminiRephraseRecipeWithSwaps;
window.GEMINI_MODEL_CASCADE = GEMINI_MODEL_CASCADE;
window.isSafeGeminiModel = isSafeGeminiModel;
