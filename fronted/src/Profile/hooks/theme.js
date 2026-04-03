export const T = {

  forest: "#1c3829",
  sage: "#3d6b4f",
  mint: "#5a9e72",
  lime: "#8dc87a",

  cream: "#f7f2e8",
  oat: "#ede6d6",

  red: "#e05252",
  blue: "#4a8fc0",
  purple: "#7b68c8"
  

};

export const calcBMI = (w, h) => {
  if (!w || !h) return 0;
  return +(w / Math.pow(h / 100, 2)).toFixed(1);
};

export const getBMIInfo = (bmi) => {
  if (bmi < 18.5) return { label: "Underweight", color: T.blue, tip: "Try nutrient-dense meals." };
  if (bmi < 25) return { label: "Normal", color: T.mint, tip: "You are doing great!" };
  if (bmi < 30) return { label: "Overweight", color: T.gold, tip: "Watch your portion sizes." };
  return { label: "Obese", color: T.red, tip: "Consult a nutritionist." };
};

export const calcTDEE = (w, h, a, g, act = 1.2) => {
  if (!w || !h || !a) return 0;
  const bmr = g === "male" 
    ? 88.36 + (13.4 * w) + (4.8 * h) - (5.7 * a)
    : 447.59 + (9.2 * w) + (3.1 * h) - (4.3 * a);
  return Math.round(bmr * act);
};

export default T;