import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Tile } from "../design";

function Home() {
  const { balanceData, savingsData, spendData,isDark } = useAppContext();

  const [savingsBalance, setSavingsBalance] = useState(0);
  const [primaryBalance, setPrimaryBalance] = useState(0);
  const [latestSpendBalance, setLatestSpendBalance] = useState(0);
  const [currentMonthSavings, setCurrentMonthSavings] = useState(0);
  const [typeTotals, setTypeTotals] = useState({});

  const monthName = new Date().toLocaleString("default", { month: "long" });

  /* ===============================
     Latest Savings Balance
  ================================ */
  useEffect(() => {
    if (savingsData?.length) {
      const last = savingsData[savingsData.length - 1];
      setSavingsBalance(
        parseFloat(String(last["Balance after spend (INR)"]).replace(/,/g, "")) || 0
      );
    }
  }, [savingsData]);

  /* ===============================
     Latest Primary Balance
  ================================ */
  useEffect(() => {
    if (balanceData?.length) {
      const last = balanceData[balanceData.length - 1];
      setPrimaryBalance(
        parseFloat(String(last["Balance after spend (INR)"]).replace(/,/g, "")) || 0
      );
    }
  }, [balanceData]);

  /* ===============================
     Latest Spend Balance
  ================================ */
  /* ===============================
  Latest Spend Balance
=============================== */
  useEffect(() => {
    if (!spendData?.length) {
      setLatestSpendBalance(0);
      return;
    }

    const last = spendData[spendData.length - 1];

    // Find the key dynamically to avoid extra spaces issue
    const balanceKey = Object.keys(last).find(
      k => k.trim() === "Balance after transaction"
    );

    if (!balanceKey) {
      setLatestSpendBalance(0);
      return;
    }

    const balanceStr = last[balanceKey];
    const balance = parseFloat(String(balanceStr).replace(/,/g, ""));
    setLatestSpendBalance(!isNaN(balance) ? balance : 0);
  }, [spendData]);


  /* ===============================
     Current Month Savings (SUM)
  ================================ */
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-based
    const currentYear = now.getFullYear();

    let total = 0;
    if (savingsData?.length) {
      savingsData.forEach(entry => {
        if (!entry.Date || !entry["Amount (INR)"]) return;

        const [dd, mm, yyyy] = entry.Date.split("-").map(Number);
        if (mm - 1 === currentMonth && yyyy === currentYear) {
          const amount = parseFloat(String(entry["Amount (INR)"]).replace(/,/g, ""));
          total += amount || 0;
        }
      });
    }

    setCurrentMonthSavings(total);
  }, [savingsData]);

  /* ===============================
     Calculate totals per Type
     Handle Lend separately
  ================================ */
  useEffect(() => {
    if (!balanceData?.length) return;

    const totals = {};
    let totalLoanGiven = 0;
    let totalLendReturn = 0;

    balanceData.forEach(entry => {
      const type = entry.Type?.trim();
      const category = entry.Category?.trim();

      if (!type || type === "Income" || type === "Nothing") return;
      if (category === "Transfer") return;

      const amount = parseFloat(String(entry["Amount (INR)"]).replace(/,/g, "")) || 0;

      if (type === "Lend") {
        if (category === "Loan Given") totalLoanGiven += amount;
        else if (category === "Lend Return") totalLendReturn += amount;
      } else {
        totals[type] = (totals[type] || 0) + amount;
      }
    });

    totals["Lend"] = totalLoanGiven - totalLendReturn;

    setTypeTotals(totals);
  }, [balanceData]);

  return (
    <div className={`p-6 min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
  {/* Row 1 */}
  <div className="flex flex-wrap gap-6">
    <Tile title="Savings" value={savingsBalance} />
    <Tile title="Primary Account" value={primaryBalance-latestSpendBalance} />
    <Tile title="Spend Balance" value={latestSpendBalance} />
  </div>

  {/* Row 2 */}
  <div className="mt-6 flex flex-wrap gap-6">
    <Tile title={`${monthName}'s Saving`} value={currentMonthSavings} />
    {Object.entries(typeTotals).map(([type, amount]) => (
      <Tile key={type} title={type} value={amount} />
    ))}
  </div>
</div>

  );
}

export default Home;