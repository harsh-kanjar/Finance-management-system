import React from "react";
import { StdDevChart, TransactionsType } from "../components";
import { useAppContext } from "../context/AppContext";

function TransactionsAnalysis() {
  const { balanceData, isDark } = useAppContext();

  return (
    <div className={`p-2 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="mb-6">
        <TransactionsType />
      </div>

      <div className="mb-6">
        <StdDevChart balanceData={balanceData} />
      </div>
    </div>
  );
}

export default TransactionsAnalysis;
