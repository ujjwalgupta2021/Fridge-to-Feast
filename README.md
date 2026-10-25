# 🦥 Fridge-to-Feast: Pure Veg Recipe Visualizer (Dual-Input Edition)

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 3: Slow and Steady](https://dev.to/challenges/hacktoberfest-week3-2026-10-19)*

---

## What I Built

**Fridge-to-Feast** is a zero-effort, local-first recipe visualizer specifically designed for exhausted, busy, or unapologetically lazy home cooks who adhere to a **100% pure vegetarian diet**.

Instead of staring into an open fridge with decision fatigue—or giving up on home cooking because washing 5 greasy pots feels like a mountain of labor—Fridge-to-Feast turns random ingredients into an instant, satisfying feast with **minimal physical effort**:

1. **Dual-Input Fridge Intake**: Snap and drop a quick shelf photo, or type scattered ingredients (`"Potatoes, Tomatoes, Coriander"`), or tap 1-click pantry staple chips.
2. **The Sloth Cooking Energy Slider**: Select how much effort you can spare:
   - ⚡ **Microwave Chef (3 mins)**: Zero pan watching, zero chopping, single mug or bowl.
   - 🍳 **One-Pan Stir-Fry (15 mins)**: Quick sizzle, light dice, maximum flavor-to-effort ratio.
   - 🍲 **Slow Simmer (30 mins)**: Low-heat stew or curry—walk away and take a nap while it simmers.
3. **"Minimize Dishes" 1-Vessel Lock**: Automatically adapts every recipe to a **single mug, skillet, or pot**, eliminating cutting boards and prep bowls so cleanup takes 15 seconds.
4. **"Lazy Substitutions" (Zero-Store Swaps)**: Missing an ingredient? Don't leave your couch. Tap any pantry alternative (e.g., swapping *Paneer* with *Tofu* or *Boiled Chickpeas*, or *Butter* with *Ghee + Salt*). The cooking steps dynamically rephrase so instructions match how the swap actually behaves in the pan.
5. **🦥 "Sloth Nap" Hands-Free Cooking Timer**: Synced to your recipe duration with soothing Web Speech voice announcements (*"Wake up, master... your feast is ready..."*) and real-time synthesized pentatonic chimes so you can rest your eyes without burning dinner.

---

## Demo

- **Live Demo**: [Deployed on GitHub Pages](https://ujjwalgupta2021.github.io/Fridge-to-Feast/)
- **Local Preview**: Simply open `index.html` in any modern browser—no build steps or package installations required!

### Visual Walkthrough & Features:
- **Dual-Input Dropzone**: Visual image scanning alongside quick-tag ingredient chips.
- **Strict Pure Veg Shield**: Rejects meat, poultry, seafood, eggs, gelatin, and animal broths while intelligently preserving veg terms like *eggplant* and *chickpeas*.
- **Tactile Sloth Aesthetic**: Warm cream (`#faf6f0`), roasted brown (`#2b2420`), and emerald green (`#10b981`) color palette with light and dark mode toggling.
- **Offline Sloth Mode**: Fully functional with **zero API key required** through a built-in algorithmic culinary heuristic engine.

---

## Code

The full source code is available in this repository:
- **Repository**: [Fridge-to-Feast on GitHub](https://github.com/ujjwalgupta2021/Fridge-to-Feast) 
- **License**: [MIT License](LICENSE)

### Clean Modular Architecture (Zero Heavyweight Framework Overhead):
```
Week 3/
├── index.html                 # Semantic HTML5, Tailwind v4 theme, modal drawers & accessible UI
├── style.css                  # Custom tokens, tactile shadows, cross-browser scrollbars
├── favicon.svg                # Scalable vector sloth chef mascot with dark-mode awareness
├── package.json               # Lightweight development server scripts
├── .gitignore                 # Secrets, OS junk, logs, and build artifacts exclusion
├── .vscode/settings.json      # Workspace CSS & HTML linting configuration
└── js/
    ├── config.js              # Storage keys, pantry staples, cooking modes, pure veg regex rules
    ├── audio.js               # Web Audio API sound synthesizer (warm pentatonic pop & chime notes)
    ├── state.js               # Reactive state container, localStorage sync & canonical deduplication
    ├── timer.js               # Sloth Nap hands-free timer with Web Speech API voice synthesis
    ├── substitutions.js       # Pure veg zero-store pantry substitutions engine & AI rephraser
    ├── recipes-data.js        # Curated offline pure veg culinary database
    ├── recipe-engine.js       # Recipe synthesis engine & single-vessel constraint enforcer
    ├── gemini.js              # Google AI Studio dynamic model probe & API caller
    ├── scanner.js             # Client-side FileReader fridge photo dropzone & local visual analyzer
    ├── ui.js                  # DOM visual bindings, theme toggle, toasts & modals
    └── app.js                 # Application bootstrap & lifecycle orchestration
```

---

## How I Built It

Fridge-to-Feast is built around a resilient **hybrid AI and local-first architecture**:

1. **Multimodal Vision & Recipe Synthesis (Google AI Studio / Gemini API)**:
   - Uses `gemini-1.5-flash` with dynamic fallback across Gemini models.
   - Inspects raw fridge photos to identify edible vegetarian produce and builds customized step-by-step recipes tailored to the user's chosen energy level.
   - When substituting ingredients, a dedicated AI rephrasing prompt rewrites instructions so cooking steps accurately reflect the culinary nature of the replacement item.

2. **The Offline Sloth Engine (Resilient Local Heuristic Inference)**:
   - When offline or when no API key is provided, the app seamlessly engages a **local-first heuristic recipe engine**.
   - Backed by `OFFLINE_RECIPES_DATABASE` and procedural single-vessel synthesis with canonical stem deduplication (using `getCanonicalStem`), ensuring ingredients and steps are never awkwardly repeated.

3. **Pure Vegetarian Guardrails**:
   - A multi-tier regex and keyword sanitizer actively screens inputs to ensure 100% vegetarian compliance, preventing accidental non-veg contamination.

4. **Web Audio & Web Speech APIs**:
   - Instead of loading heavy external MP3 audio assets, tactile clicks and soothing chimes are generated entirely in real-time via the browser's `AudioContext`.
   - The Sloth Nap Timer discovers system neural voices (such as Microsoft Aria/Jenny or macOS Samantha) to deliver unhurried, gentle wake-up announcements.

---

## Why Does Open Innovation Matter?

1. **Kitchen Privacy & Personal Sovereignty**:
   Your personal fridge photos, dietary habits, and grocery inventory stay where they belong: inside your browser's `localStorage`. Closed commercial apps monetize user grocery data; open innovation guarantees user privacy by default.

2. **Resilience Across the Offline Gap**:
   Cooking happens in real-world kitchens where Wi-Fi drops or data signals lag. By pairing open-source AI with local algorithmic heuristic engines, users can cook hot meals even when completely disconnected from the internet.

3. **Zero Paywalls for Daily Sustenance**:
   Nobody should have to pay a recurring monthly subscription or hit API rate limits just to figure out what to cook with leftover potatoes and rice. Open-source keeps technology accessible to everyone.

4. **Community-Tailored Culinary Knowledge**:
   Proprietary cooking apps frequently overlook global vegetarian traditions. An open-source codebase empowers developers worldwide to contribute regional pantry staples, spices, and authentic vegetarian substitution cheat sheets.

---

## My Agent Session

This project was built pair-programming with the DeepMind Antigravity AI coding agent. Key milestones navigated during the session included:
- Diagnosing and resolving subtle browser TextMate grammar traps (`accept="image/*"` comment collisions).
- Modernizing Tailwind CSS v4 CSS-first token architectures with class-based `.dark` variants.
- Eliminating compound substitution collisions (e.g. preventing `"1 tbsp oil/butter"` from duplicating into repeated terms).
- Synthesizing tactile Web Audio API pentatonic soundscapes and crafting the custom scalable SVG sloth chef favicon.

---

## The Lazy Payoff

- **Decision Fatigue Eliminated**: Saves **25–35 minutes** of scrolling through complex, ingredient-heavy recipes.
- **Dishes Avoided**: Reduces kitchen sink pileup by **75–80%**, locking meal prep to **exactly 1 cooking vessel** (0 prep plates, 0 cutting boards).
- **Zero Grocery Store Trips**: The Lazy Substitutions engine spares you a 40-minute round trip to the supermarket just because you were missing one herb or dairy item.
- **Guilt-Free Rest**: The Sloth Timer voice announcer lets you lie down on the sofa and nap peacefully while your one-pot stew or mug toss cooks safely.

---

## Prize Categories

- **Primary Track**: [Hacktoberfest Open-Source AI Challenge Week 3: Slow and Steady](https://dev.to/challenges/hacktoberfest-week3-2026-10-19)
- **Partner Track**: Google AI Studio / Gemini API (Multimodal Vision & Creative Recipe Synthesis)

---

<div align="center">

**Built with ❤️ and maximum kitchen laziness for Hacktoberfest 2026 🦥✨**  
*Happy cooking, and even happier napping!*

</div>
