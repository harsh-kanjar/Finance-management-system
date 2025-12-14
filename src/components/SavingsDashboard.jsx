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

function SavingsDashboard({ data }) {
  // Process data
  const { chartData, tableData, chartTrend } = useMemo(() => {
    if (!data || data.length === 0)
      return { chartData: [], tableData: [], chartTrend: "flat" };

    // Parse data
    const parsed = data.map((d) => {
      const balance = Number(d["Balance after spend (INR)"].replace(/,/g, ""));
      const [day, month, year] = d.Date.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

      return { ...d, DateObj: dateObj, Balance: balance };
    });

    // Sort by date
    parsed.sort((a, b) => a.DateObj - b.DateObj);

    // Chart Data
    const chartData = parsed.map((d) => ({
      Date: d.DateObj.toISOString().split("T")[0],
      Balance: d.Balance,
    }));

    // Table Data
    const tableData = chartData.map((d, i) => {
      if (i === 0) return { ...d, Difference: 0, PercentChange: 0 };

      const prev = chartData[i - 1];
      const diff = d.Balance - prev.Balance;
      const pct = (diff / prev.Balance) * 100;

      return {
        ...d,
        Difference: diff,
        PercentChange: pct,
      };
    });

    // TREND DETECTION
    let chartTrend = "flat";

    if (chartData.length > 1) {
      const first = chartData[0].Balance;
      const last = chartData[chartData.length - 1].Balance;
      const diff = last - first;
      const pct = (diff / first) * 100;

      if (pct > 2) chartTrend = "up";
      else if (pct < -2) chartTrend = "down";
      else chartTrend = "flat";
    }

    return { chartData, tableData, chartTrend };
  }, [data]);

  if (!data || data.length === 0) return <p>Loading...</p>;

  // Trend-based color classes
  const trendClasses =
    chartTrend === "up"
      ? "bg-green-50 border-green-300 text-green-700"
      : chartTrend === "down"
      ? "bg-red-50 border-red-300 text-red-700"
      : "bg-yellow-50 border-yellow-300 text-yellow-700";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Trend-Based Line Chart */}
      <div className={`p-4 rounded-xl shadow border ${trendClasses}`}>
        <h2 className="text-xl font-semibold mb-2">
          Savings Over Time
          <span className="block text-sm opacity-70 mt-1">
            {chartTrend === "up" && "Positive Trend — Savings Increasing"}
            {chartTrend === "down" && "Negative Trend — Savings Decreasing"}
            {chartTrend === "flat" && "Stable Trend — No Major Change"}
          </span>
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" hide/>
            <YAxis />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })
              }
            />
            <Line
              type="monotone"
              dataKey="Balance"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Difference Table */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Balance Changes</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Balance (INR)
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Difference (INR)
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                % Change
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {tableData.map((d, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{d.Date}</td>
                <td className="px-4 py-2 text-sm">
                  {d.Balance.toLocaleString("en-IN")}
                </td>

                <td
                  className={`px-4 py-2 text-sm ${
                    d.Difference < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {d.Difference.toLocaleString("en-IN")}
                </td>

                <td
                  className={`px-4 py-2 text-sm ${
                    d.PercentChange < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {d.PercentChange.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SavingsDashboard;
