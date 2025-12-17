// components/StatTile.jsx
import { useAppContext } from "../context/AppContext";

const Tile = ({ title, value }) => {
  const { isDark } = useAppContext();

  // Conditional classes based on dark mode
  const containerClass = `
    rounded-2xl
    shadow-sm
    border p-5
    min-w-[200px]
    hover:shadow-md
    transition-all
    duration-200
    ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}
  `;

  const titleClass = `
    text-xs font-semibold uppercase tracking-wider 
    ${isDark ? "text-gray-400" : "text-gray-500"}
  `;

  const valueClass = `
    mt-2 text-3xl font-bold
    ${isDark ? "text-white" : "text-gray-800"}
  `;

  const accentClass = `
    mt-3 h-1 w-10 rounded-full 
    bg-gradient-to-r from-indigo-500 to-purple-500
  `;

  return (
    <div className={containerClass}>
      {/* Title */}
      <div className={titleClass}>{title}</div>

      {/* Value */}
      <div className={valueClass}>₹ {value.toLocaleString()}</div>

      {/* Accent bar */}
      <div className={accentClass} />
    </div>
  );
};

export default Tile;