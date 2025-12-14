import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

function Navbar() {
  const menuRef = useRef();

  const [managerOpen, setManagerOpen] = useState(false);
  const [hoverFunds, setHoverFunds] = useState(false);
  const [hoverSavings, setHoverSavings] = useState(false);

  // Close menus if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setManagerOpen(false);
        setHoverFunds(false);
        setHoverSavings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to open only one submenu at a time
  const handleHoverFunds = () => {
    setHoverFunds(true);
    setHoverSavings(false);
  };

  const handleHoverSavings = () => {
    setHoverSavings(true);
    setHoverFunds(false);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="flex justify-around items-center">
        <div className="text-2xl font-bold text-gray-800">Where is my money ?</div>

        <div className="mx-4 flex gap-3">
          <Link
            to="sips"
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold
               hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600
               transition-all duration-200 shadow-sm"
          >
            SIP
          </Link>

          <Link
            to="/mainAC"
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold
               hover:bg-green-50 hover:border-green-400 hover:text-green-600
               transition-all duration-200 shadow-sm"
          >
            Main A/C
          </Link>

          <Link
            to="/allTransactions"
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold
               hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600
               transition-all duration-200 shadow-sm"
          >
            All Transactions
          </Link>
        </div>


        <div className="flex space-x-6 relative" ref={menuRef}>
          {/* Manager Dropdown */}
          <div className="relative">
            <button
              onClick={() => setManagerOpen(!managerOpen)}
              className="flex items-center px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
            >
              Manager <FiChevronDown className="ml-1" />
            </button>

            {managerOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {/* Funds submenu */}
                <div
                  className="relative"
                  onMouseEnter={handleHoverFunds}
                  onMouseLeave={() => setHoverFunds(false)}
                >
                  <button className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100">
                    Funds <FiChevronRight />
                  </button>
                  {hoverFunds && (
                    <div className="absolute top-0 right-full mr-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                      <NavLink
                        to="/add-funds"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Add
                      </NavLink>
                      <NavLink
                        to="/withdraw-funds"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Withdraw
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Savings submenu */}
                <div
                  className="relative"
                  onMouseEnter={handleHoverSavings}
                  onMouseLeave={() => setHoverSavings(false)}
                >
                  <button className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100">
                    Savings <FiChevronRight />
                  </button>
                  {hoverSavings && (
                    <div className="absolute top-0 right-full mr-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                      <NavLink
                        to="/add-savings"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Add
                      </NavLink>
                      <NavLink
                        to="/withdraw-savings"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Withdraw
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;