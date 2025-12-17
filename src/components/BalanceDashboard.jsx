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

function BalanceDashboard({ data }) {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  // const [isDark, setIsDark] = useState(false);
  const {isDark} = useAppContext();

  const { chartData, tableData } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], tableData: [] };

    const parsedData = data.map((d) => {
      const balance = +d["Balance after spend (INR)"].replace(/,/g, "");
      const [day, month, year] = d.Date.split("-");
      const date = new Date(`${year}-${month}-${day}`);
      return { ...d, Date: date, Balance: balance };
    });

    parsedData.sort((a, b) => a.Date - b.Date);

    const chartData = parsedData.map((d) => ({
      Date: d.Date.toISOString().split("T")[0],
      Balance: d.Balance,
    }));

    const tableData = chartData.map((d, i) => {
      if (i === 0) return { ...d, Difference: 0, PercentChange: 0 };
      const diff = d.Balance - chartData[i - 1].Balance;
      const percent = (diff / chartData[i - 1].Balance) * 100;
      return { ...d, Difference: diff, PercentChange: percent };
    });

    return { chartData, tableData };
  }, [data]);

  if (!data || data.length === 0) return <p>Loading...</p>;

  /* ===== THEME STYLES ===== */
  const theme = {
    page: isDark ? "bg-gray-900" : "bg-gray-100",
    card: isDark ? "bg-gray-800" : "bg-white",
    text: isDark ? "text-gray-100" : "text-gray-900",
    subText: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-gray-700" : "border-gray-200",
    modalBg: isDark ? "bg-gray-800" : "bg-white",
    overlay: "bg-black bg-opacity-60",
  };

  return (
    <div className={` p-4 transition-colors ${theme.page}`}>
      <div className="flex gap-4">

        {/* CHART CARD */}
        <div className={`flex-1 p-4 rounded-xl shadow ${theme.card}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className={`text-xl font-semibold ${theme.text}`}>
              Main A/C Activities
            </h2>

            <div className="flex gap-2">

              {/* TABLE BUTTON */}
              <button
                onClick={() => setIsTableModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Table
              </button>
            </div>
          </div>

          {/* Chart */}
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
                stroke="#4B7BEC"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODAL */}
      {isTableModalOpen && (
        <div className={`fixed inset-0 z-50 flex justify-center items-start p-4 ${theme.overlay}`}>
          <div className={`w-full max-w-4xl p-6 rounded-xl relative ${theme.modalBg}`}>
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
              <table className="min-w-full border-collapse">
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
                      <td className={`px-4 py-2 text-sm ${theme.text}`}>
                        {d.Date}
                      </td>
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

export default BalanceDashboard;