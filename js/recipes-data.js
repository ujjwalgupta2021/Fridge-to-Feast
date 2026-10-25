/**
 * Fridge-to-Feast | Offline Culinary Heuristic Database
 * Curated 100% pure vegetarian recipes mapped to cooking energy levels & kitchen laziness
 */

const OFFLINE_RECIPES_DATABASE = [
  // ⚡ MICROWAVE CHEF (Level 0)
  {
    mode: 0,
    requiredAny: ["paneer", "capsicum", "tomatoes", "cheese"],
    title: "3-Minute Cheesy Paneer Tikka Mug Bowl",
    description: "Tender paneer cubes and sweet capsicum tossed in chaat masala, melted cheese, and toasted in a single microwave mug.",
    cookware: "1 Microwave-Safe Mug or Bowl",
    timeStr: "3 mins",
    timeSaved: "35 mins",
    dishesSaved: "4 Pots/Pans",
    ingredients: ["Paneer cubes (100g)", "Diced Capsicum (1/4 cup)", "Tomato puree/slices", "Cumin & Chaat Masala", "Grated Cheese (optional)"],
    steps: [
      "Dice paneer and capsicum directly over your microwave bowl (no cutting board needed!).",
      "Toss with 1 tsp oil/butter, salt, cumin powder, and a squeeze of tomato.",
      "Microwave on HIGH for 2 minutes until paneer is soft and peppers are tender.",
      "Sprinkle cheese or chaat masala on top and microwave for another 45 seconds to melt.",
      "Garnish with cilantro and eat straight from the mug with a fork!"
    ],
    singleDishTip: "Eat straight out of the mug to avoid washing even a single plate. Rinse time: 10 seconds!"
  },
  {
    mode: 0,
    requiredAny: ["rice", "potatoes", "spinach", "peas"],
    title: "Instant Microwave Lemon-Herb Comfort Rice",
    description: "Fluffy steamed rice with vibrant green peas and crushed cumin, zapped in 3 minutes for instant pure-veg comfort.",
    cookware: "1 Deep Microwave Casserole Bowl",
    timeStr: "4 mins",
    timeSaved: "30 mins",
    dishesSaved: "3 Pots/Pans",
    ingredients: ["Cooked/Instant Rice (1 cup)", "Green Peas", "Cumin Seeds", "Lemon juice", "Fresh Cilantro"],
    steps: [
      "Add rice, green peas, and 2 tbsp water directly into your microwave bowl.",
      "Drizzle with 1 tsp ghee or oil, salt, and cumin seeds.",
      "Cover loosely with a paper towel and microwave on HIGH for 3 minutes.",
      "Stir gently, squeeze fresh lemon juice on top, and fold in cilantro.",
      "Serve warm straight in the cooking bowl."
    ],
    singleDishTip: "The paper towel absorbs steam splatters so your microwave stays spotless."
  },

  // 🍳 ONE-PAN STIR-FRY (Level 1)
  {
    mode: 1,
    requiredAny: ["paneer", "capsicum", "tomatoes", "onions"],
    title: "Warm Paneer & Crispy Capsicum Skillet Toss",
    description: "Golden griddled paneer and crunchy bell peppers sizzled with aromatic cumin and mild Indian spices in a single skillet.",
    cookware: "1 Cast-Iron Skillet & 1 Spatula",
    timeStr: "15 mins",
    timeSaved: "25 mins",
    dishesSaved: "3 Pans",
    ingredients: ["Paneer cubes (150g)", "Sliced Capsicum", "1 Diced Tomato", "Cumin seeds", "1 tbsp Olive Oil or Ghee", "Chaat Masala"],
    steps: [
      "Heat 1 tbsp oil in your single skillet over medium flame and crackle cumin seeds.",
      "Add paneer cubes directly to the pan and sear for 3 minutes until light golden on two sides.",
      "Slide paneer to one side of the skillet; drop sliced capsicum and tomatoes into the open side.",
      "Stir-fry veggies for 4-5 minutes until crisp-tender while paneer absorbs the juices.",
      "Toss everything together with salt and chaat masala, switch off the heat, and eat from the pan!"
    ],
    singleDishTip: "By searing the paneer and sautéing the veggies in the same skillet simultaneously, no prep bowls are required."
  },
  {
    mode: 1,
    requiredAny: ["potatoes", "rice", "onions", "peas"],
    title: "1-Skillet Golden Aloo Jeera Fried Rice",
    description: "Tender spiced potatoes and sweet peas seared with cumin seeds, tossed with fragrant rice in one blazing pan.",
    cookware: "1 Non-Stick Skillet",
    timeStr: "14 mins",
    timeSaved: "28 mins",
    dishesSaved: "3 Pans",
    ingredients: ["Cooked Rice (1.5 cups)", "Boiled/Diced Potatoes", "Green Peas", "1 tsp Cumin Seeds", "Turmeric & Salt"],
    steps: [
      "Heat 1 tbsp oil in your skillet and toast cumin seeds until fragrant.",
      "Drop diced potatoes into the sizzling oil, dust with turmeric and salt, and crisp for 5 minutes.",
      "Add green peas and toss for 2 minutes.",
      "Pour your rice directly into the pan, breaking up clumps with your spatula.",
      "Stir-fry on high heat for 3 minutes until piping hot and fragrant. Dig in!"
    ],
    singleDishTip: "No extra serving dish required—let the cast iron keep your meal warm while you eat."
  },

  // 🍲 SLOW SIMMER (Level 2)
  {
    mode: 2,
    requiredAny: ["rice", "lentils", "potatoes", "spinach", "tomatoes"],
    title: "Cozy One-Pot Sloth Vegetable Khichdi",
    description: "The ultimate pure vegetarian comfort food. Rice, golden lentils, and garden vegetables slowly simmered into a buttery porridge.",
    cookware: "1 Deep Soup Pot & Wooden Spoon",
    timeStr: "30 mins",
    timeSaved: "20 mins",
    dishesSaved: "3 Pots",
    ingredients: ["Basmati Rice (1/2 cup)", "Yellow Lentils/Moong Dal (1/2 cup)", "Diced Potatoes & Tomatoes", "1 tbsp Ghee", "Cumin & Turmeric", "3 cups Water"],
    steps: [
      "Melt 1 tbsp ghee in your soup pot; sizzle cumin seeds and turmeric for 30 seconds.",
      "Toss in chopped tomatoes, potatoes, or any vegetables from your fridge.",
      "Rinse rice and lentils together directly in the pot, add 3 cups water and 1 tsp salt.",
      "Bring to a boil, then turn the flame to the lowest setting, cover with a lid, and walk away.",
      "Let it simmer undisturbed for 20-25 minutes while you relax or nap. Stir once, top with ghee, and savor!"
    ],
    singleDishTip: "The lowest flame lets the lentils dissolve into creamy comfort without boiling over or burning."
  },
  {
    mode: 2,
    requiredAny: ["paneer", "tomatoes", "onions", "capsicum"],
    title: "Slow-Simmered Creamy Tomato-Paneer Stew",
    description: "Fresh paneer submerged in a rich, buttery tomato broth with subtle cumin undertones, simmered on low flame.",
    cookware: "1 Saucepan & 1 Spoon",
    timeStr: "28 mins",
    timeSaved: "22 mins",
    dishesSaved: "3 Pans",
    ingredients: ["Paneer cubes (150g)", "3 Crushed Tomatoes", "1 Sliced Onion", "Cumin & Garam Masala", "1/4 cup Milk/Cream", "1 tbsp Butter"],
    steps: [
      "Sauté onions and cumin seeds in butter inside your saucepan for 5 minutes until sweet and golden.",
      "Add crushed tomatoes and salt, bring to a gentle bubble, and cover.",
      "Simmer on low heat for 15 minutes until tomatoes reduce into a glossy sauce.",
      "Pour in a splash of milk or cream and drop paneer cubes directly into the simmering sauce.",
      "Cook on gentle heat for 5 more minutes until paneer is pillow-soft. Enjoy warm!"
    ],
    singleDishTip: "Cooking paneer directly in the simmering gravy eliminates any need for pre-frying or extra oil."
  }
];

window.OFFLINE_RECIPES_DATABASE = OFFLINE_RECIPES_DATABASE;
