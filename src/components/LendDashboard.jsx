import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function LendDashboard({ data }) {
  const { chartData, tableData, openLoans, partialClosedLoans, chartTrend } = useMemo(() => {
    if (!data || data.length === 0)
      return { chartData: [], tableData: [], openLoans: [], partialClosedLoans: [], chartTrend: "flat" };

    // x-transactions (loans given)
    const xTx = data
      .filter(d => d.Type === "Lend" && d["Loan ID"]?.startsWith("x"))
      .map(d => {
        const amount = +d["Amount (INR)"].replace(/,/g, "");
        const [day, month, year] = d.Date.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return { ...d, Amount: amount, DateObj: date };
      })
      .sort((a, b) => a.DateObj - b.DateObj);

    // Chart data: cumulative sum
    let cumSum = 0;
    const chartData = xTx.map(d => {
      cumSum += d.Amount;
      return { Date: d.Date, Amount: d.Amount, Cumulative: cumSum, LoanID: d["Loan ID"] };
    });

    // Table data with difference and % change
    const tableData = chartData.map((d, i) => {
      if (i === 0) return { ...d, Difference: 0, PercentChange: 0 };
      const diff = d.Amount;
      const percent = (diff / chartData[i - 1].Cumulative) * 100;
      return { ...d, Difference: diff, PercentChange: percent };
    });

    // y-transactions (repayments)
    const yTx = data
      .filter(d => d["Loan ID"]?.startsWith("y"))
      .map(d => {
        const amount = +d["Amount (INR)"].replace(/,/g, "");
        const [day, month, year] = d.Date.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return { ...d, Amount: amount, DateObj: date };
      });

    const partialClosedLoans = yTx.map(d => ({
      Date: d.Date,
      Amount: d.Amount,
      LoanID: d["Loan ID"]
    }));

    const openLoans = xTx.map(d => ({
      Date: d.Date,
      Amount: d.Amount,
      LoanID: d["Loan ID"]
    }));

    // Detect trend: cumulative increase -> red, decrease -> green, flat -> yellow
    let chartTrend = "flat";
    if (chartData.length > 1) {
      const first = chartData[0].Cumulative;
      const last = chartData[chartData.length - 1].Cumulative;
      const diff = last - first;
      const pct = (diff / first) * 100;
      if (pct > 2) chartTrend = "up";        // money lent increased
      else if (pct < -2) chartTrend = "down"; // money lent decreased (repayments)
      else chartTrend = "flat";
    }

    return { chartData, tableData, openLoans, partialClosedLoans, chartTrend };
  }, [data]);

  if (!data || data.length === 0) return <p>Loading Lend data...</p>;

  // Trend-based chart classes & line color
  const trendClasses =
    chartTrend === "up"
      ? "bg-red-50 border-red-300 text-red-700"
      : chartTrend === "down"
        ? "bg-green-50 border-green-300 text-green-700"
        : "bg-yellow-50 border-yellow-300 text-yellow-700";

  const lineColor = chartTrend === "up" ? "#EF4444" : chartTrend === "down" ? "#10B981" : "#FBBF24";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Chart */}
      <div className={`p-4 rounded-xl shadow border ${trendClasses}`}>
        <h2 className="text-xl font-semibold mb-2">
          Cumulative Lend Over Time
          <span className="block text-sm opacity-70 mt-1">
            {chartTrend === "up" && "Lending Increasing — more money lent"}
            {chartTrend === "down" && "Lending Decreasing — repayments received"}
            {chartTrend === "flat" && "Stable Lending — minimal change"}
          </span>
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("en-IN", { style: "currency", currency: "INR" })
              }
            />
            <Line type="monotone" dataKey="Cumulative" stroke={lineColor} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lend Table */}

      <div className="max-h-96 overflow-y-auto">
        <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Lend Transactions</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount (INR)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cumulative</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Loan ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((d, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm">{d.Date}</td>
                  <td className="px-4 py-2 text-sm">{d.Amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2 text-sm">{d.Cumulative.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2 text-sm">{d.LoanID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>


      {/* Open Loans */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Open Loans (Full Amount Lent)</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount (INR)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Loan ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {openLoans.map((d, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{d.Date}</td>
                <td className="px-4 py-2 text-sm">{d.Amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 text-sm">{d.LoanID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Partial / Closed Loans */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Partial / Closed Loans (Amount Returned)</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount Returned (INR)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Loan ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partialClosedLoans.map((d, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{d.Date}</td>
                <td className="px-4 py-2 text-sm">{d.Amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 text-sm">{d.LoanID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default LendDashboard;