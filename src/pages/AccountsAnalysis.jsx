import React from "react";
import { BalanceDashboard, SavingsDashboard } from "../components";
import { useAppContext } from "../context/AppContext";

function AccountsAnalysis() {
  const { savingsData, balanceData, isDark } = useAppContext();

  const theme = {
    page: isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900",
  };

  return (
    <div className={`p-2 transition-colors ${theme.page}`}>
      <BalanceDashboard data={balanceData}/>
  
      <SavingsDashboard data={savingsData}/>
    </div>
  );
}

export default AccountsAnalysis;
