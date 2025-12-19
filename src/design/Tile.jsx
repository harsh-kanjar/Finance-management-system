import { useAppContext } from "../context/AppContext";
import Confetti from "react-dom-confetti";

const Tile = ({ title, value, limit, celebration = false }) => {
  const { isDark } = useAppContext();

  const containerClass = `
    rounded-2xl shadow-sm border p-5 min-w-[200px]
    hover:shadow-md transition-all duration-200
    ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}
    relative
  `;

  const titleClass = `
    text-xs font-semibold uppercase tracking-wider
    ${isDark ? "text-gray-400" : "text-gray-500"}
  `;

  const valueClass = `
    mt-2 text-3xl font-bold
    ${isDark ? "text-white" : "text-gray-800"}
  `;

  const percentage = limit && limit > 0 ? Math.min((value / limit) * 100, 100) : 100;

  const accentContainerClass = `
    mt-3 h-1 w-full rounded-full bg-gray-300
    ${isDark ? "bg-gray-700" : "bg-gray-300"}
  `;

  const accentBarClass = `
    h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500
    transition-all duration-500
  `;

  // ✅ Confetti config: slower, colorful
  const confettiConfig = {
    angle: 90,
    spread: 150,          // wider spread
    startVelocity: 15,    // slower start
    elementCount: 40,     // more pieces
    dragFriction: 0.12,   // slower fall
    duration: 2500,       // total duration longer
    stagger: 2,           // small delay between pieces
    width: "10px",
    height: "10px",
    colors: ["#f87171","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6"] // colorful
  };

  return (
    <div className={containerClass}>
      {/* Celebration Confetti */}
      <Confetti active={celebration} config={confettiConfig} />

      {/* Title */}
      <div className={titleClass}>{title}</div>

      {/* Value */}
      <div className={valueClass}>₹ {value.toLocaleString()}</div>

      {/* Accent bar */}
      <div className={accentContainerClass}>
        <div className={accentBarClass} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default Tile;