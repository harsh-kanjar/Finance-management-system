import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Navbar() {
  const { isDark, setIsDark } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navBg = isDark
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-800";

  const linkBase =
    "relative px-3 py-2 text-sm font-semibold transition-colors duration-200";

  const linkText = isDark
    ? "text-gray-300 hover:text-white"
    : "text-gray-600 hover:text-gray-900";

  return (
    <nav className={`${navBg} sticky top-0 z-50 shadow-sm`}>
      <div className="px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex flex-col">
          <div className="text-2xl font-bold">
            Where is my money ?
          </div>
          <div className="mt-2 h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          {[
            { to: "/", label: "Home" },
            { to: "/invested", label: "Invested" },
            { to: "/accounts", label: "Accounts" },
            { to: "/allTransactions", label: "All Transactions" },
            { to: "/lend", label: "Lend" },
            { to: "/addRecord", label: "Add Record" },
            {to:"/addSipRecord", label:"Add SIP Record"}
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${linkText}`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{label}</span>

                  {/* Accent bar */}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`ml-4 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isDark ? "bg-yellow-400 text-black" : "bg-gray-800 text-white"}
            `}
          >
            {isDark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden px-6 pb-4 flex flex-col gap-4
            ${isDark ? "bg-gray-900" : "bg-white"}
          `}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/invested", label: "Invested" },
            { to: "/accounts", label: "Accounts" },
            { to: "/allTransactions", label: "All Transactions" },
            { to: "/lend", label: "Lend" },
            { to: "/addRecord", label: "Add Record" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className="relative text-sm font-semibold"
            >
              {({ isActive }) => (
                <div className="flex flex-col w-fit">
                  <span
                    className={
                      isDark
                        ? "text-gray-300"
                        : "text-gray-700"
                    }
                  >
                    {label}
                  </span>

                  {isActive && (
                    <span className="mt-1 h-1 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  )}
                </div>
              )}
            </NavLink>
          ))}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`relative w-24 h-10 flex items-center rounded-full p-1 transition-colors duration-300
             ${isDark ? "bg-yellow-400" : "bg-gray-800"}
            `}
          >
            {/* Slider */}
            <div
              className={`absolute w-8 h-8 rounded-full bg-white shadow-md transform transition-transform duration-300
              ${isDark ? "translate-x-14" : "translate-x-0"}
            `}
            ></div>

            {/* Icons */}
            <span
              className={`absolute left-2 text-sm transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"}`}
            >
              ☀
            </span>
            <span
              className={`absolute right-2 text-sm transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"}`}
            >
              🌙
            </span>
          </button>

        </div>
      )}
    </nav>
  );
}

export default Navbar;