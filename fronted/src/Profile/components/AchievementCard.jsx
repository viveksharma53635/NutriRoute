export default function AchievementCard({ icon, title, earned }) {

  return (
    <div className={`ach-card ${earned ? "earned" : "locked"}`}>
      <span className="icon">{icon}</span>
      <span>{title}</span>
      {earned && <span className="check">✓</span>}
    </div>
  );

}