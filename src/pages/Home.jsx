import React from "react";
import { useAppContext } from "../context/AppContext";
import { Tile } from "../design";
import progressData from "../../public/progressbar.json";

export default function Home() {
  const {
    savingsBalance,
    primaryBalance,
    latestSpendBalance,
    currentMonthSavings,
    typeTotals,
    isDark
  } = useAppContext();

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div
      className={`p-4 sm:p-6 min-h-screen transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-gray-100"
        }`}
    >
      {/* Row 1 */}
      <div className="flex flex-wrap gap-4 sm:gap-6">


        <div className="w-full sm:w-auto">
          <Tile
            title="Net worth"
            value={savingsBalance + 2000}
            limit={progressData.savings}
            celebration={savingsBalance+2000 >= progressData.savings}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Tile
            title="Savings"
            value={savingsBalance}
            limit={progressData.savings}
            celebration={savingsBalance >= progressData.savings}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Tile
            title={`Invested`}
            value={2000}
            limit={progressData.invested}
            celebration={2000 >= progressData.invested}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Tile
            title={` ${monthName}'s Saving`}
            value={currentMonthSavings}
            limit={progressData.monthlySaving}
            celebration={currentMonthSavings >= progressData.monthlySaving}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Tile
            title="Spend Balance"
            value={latestSpendBalance}
            limit={progressData.spendBalance}
            celebration={latestSpendBalance >= progressData.spendBalance}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Tile
            title="Primary Account"
            value={primaryBalance - latestSpendBalance}
            limit={progressData.primaryAccount}
            celebration={primaryBalance - latestSpendBalance >= progressData.primaryAccount}
          />
        </div>


      </div>

      {/* Row 2 */}
      <div className="mt-4 sm:mt-6 flex flex-wrap gap-4 sm:gap-6">
        {Object.entries(typeTotals).map(([type, amount]) => (
          <div key={type} className="w-full sm:w-auto">
            <Tile
              title={type}
              value={amount}
              limit={progressData[type] ?? null}
              celebration={progressData[type] ? amount >= progressData[type] : false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
