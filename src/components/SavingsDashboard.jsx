import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../context/AppContext";
function SavingsDashboard({ data }) {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const {isDark} = useAppContext();

  // ================= DATA PROCESSING =================
  const { chartData, tableData, chartTrend } = useMemo(() => {
    if (!data || data.length === 0)
      return { chartData: [], tableData: [], chartTrend: "flat" };

    const parsed = data.map((d) => {
      const balance = Number(d["Balance after spend (INR)"].replace(/,/g, ""));
      const [day, month, year] = d.Date.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      return { ...d, DateObj: dateObj, Balance: balance };
    });

    parsed.sort((a, b) => a.DateObj - b.DateObj);

    const chartData = parsed.map((d) => ({
      Date: d.DateObj.toISOString().split("T")[0],
      Balance: d.Balance,
    }));

    const tableData = chartData.map((d, i) => {
      if (i === 0) return { ...d, Difference: 0, PercentChange: 0 };

      const prev = chartData[i - 1];
      const diff = d.Balance - prev.Balance;
      const pct = (diff / prev.Balance) * 100;

      return { ...d, Difference: diff, PercentChange: pct };
    });

    let chartTrend = "flat";
    if (chartData.length > 1) {
      const pct =
        ((chartData.at(-1).Balance - chartData[0].Balance) /
          chartData[0].Balance) *
        100;
      if (pct > 2) chartTrend = "up";
      else if (pct < -2) chartTrend = "down";
    }

    return { chartData, tableData, chartTrend };
  }, [data]);

  if (!data || data.length === 0) return <p>Loading...</p>;

  // ================= THEME =================
  const theme = {
    page: isDark ? "bg-gray-900" : "bg-gray-100",
    card: isDark ? "bg-gray-800" : "bg-white",
    text: isDark ? "text-gray-100" : "text-gray-900",
    subText: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-gray-700" : "border-gray-200",
    modal: isDark ? "bg-gray-800" : "bg-white",
    overlay: "bg-black bg-opacity-60",
  };

  const trendStyle =
    chartTrend === "up"
      ? isDark
        ? ""
        : "bg-green-50 border-green-300 text-green-700"
      : chartTrend === "down"
      ? isDark
        ? "bg-red-900/30 border-red-600 text-red-400"
        : "bg-red-50 border-red-300 text-red-700"
      : isDark
      ? "bg-yellow-900/30 border-yellow-600 text-yellow-400"
      : "bg-yellow-50 border-yellow-300 text-yellow-700";

  // ================= UI =================
  return (
    <div className={`m-2 p-2 transition-colors ${theme.page}`}>
      {/* CHART CARD */}
      <div className={`p-4 rounded-xl shadow  ${theme.card} ${trendStyle}`}>
        <div className="flex justify-between items-start mb-3">
          <h2 className={`text-xl font-semibold ${theme.text}`}>
            Saving A/C Activities
            <span className={`block text-sm mt-1 ${theme.subText}`}>
              {chartTrend === "up" && "Positive Trend — Savings Increasing"}
              {chartTrend === "down" && "Negative Trend — Savings Decreasing"}
              {chartTrend === "flat" && "Stable Trend — No Major Change"}
            </span>
          </h2>

          <button
            onClick={() => setIsTableModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Table
          </button>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke={isDark ? "#374151" : "#E5E7EB"} />
            <XAxis dataKey="Date" hide />
            <YAxis stroke={isDark ? "#9CA3AF" : "#374151"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                color: isDark ? "#FFFFFF" : "#000000",
                borderRadius: "8px",
              }}
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

      {/* MODAL */}
      {isTableModalOpen && (
        <div className={`fixed inset-0 z-50 p-4 flex justify-center ${theme.overlay}`}>
          <div className={`w-full max-w-4xl p-6 rounded-xl relative ${theme.modal}`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>
              Balance Changes
            </h2>

            <button
              onClick={() => setIsTableModalOpen(false)}
              className={`absolute top-4 right-4 text-2xl ${theme.subText}`}
            >
              ×
            </button>

            <div className="overflow-x-auto max-h-[70vh]">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {["Date", "Balance", "Difference", "% Change"].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-2 text-left text-sm border-b ${theme.border} ${theme.subText}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {tableData.map((d, idx) => (
                    <tr key={idx}>
                      <td className={`px-4 py-2 text-sm ${theme.text}`}>{d.Date}</td>
                      <td className={`px-4 py-2 text-sm ${theme.text}`}>
                        {d.Balance.toLocaleString("en-IN")}
                      </td>
                      <td
                        className={`px-4 py-2 text-sm ${
                          d.Difference < 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {d.Difference.toLocaleString("en-IN")}
                      </td>
                      <td
                        className={`px-4 py-2 text-sm ${
                          d.PercentChange < 0 ? "text-red-500" : "text-green-500"
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
        </div>
      )}
    </div>
  );
}

export default SavingsDashboard;
