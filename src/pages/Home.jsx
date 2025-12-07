import React from "react";
import { useAppContext } from "../context/AppContext";
import {
  BalanceDashboard,
  SavingsDashboard,
  LendDashboard,
  SpendDashboard
} from "../components";
import StdDevChart from "../components/StdDevChart";

function Home() {
  const { balanceData, savingsData, spendData, loading } = useAppContext();

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics Dashboard</h1>

      <SpendDashboard data={spendData} />
      <br />

      <StdDevChart balanceData={balanceData} />
      <br />

      <SavingsDashboard data={savingsData} />
      <br />

      {/* <BalanceDashboard data={balanceData} /> */}
      <br />

      <LendDashboard data={balanceData} />
      <br />
    </div>
  );
}

export default Home;