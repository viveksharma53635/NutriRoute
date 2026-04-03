import mealHistory from "./HistorySection";
function calculateBadges(meals) {

  const badges = calculateBadges(mealHistory);

  if (meals.length >= 7) {
    badges.push({
      icon: "🔥",
      label: "7-Day Streak",
      desc: "Logged meals 7 times"
    });
  }

  if (meals.some(m => m.tag === "veg")) {
    badges.push({
      icon: "🥗",
      label: "Veggie Lover",
      desc: "Logged vegetarian meals"
    });
  }

  return badges;
  
}


export default calculateBadges;