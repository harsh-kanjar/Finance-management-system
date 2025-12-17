import React, { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TransactionsType() {
  const { balanceData, isDark } = useAppContext();

  const { chartData, methods, averages } = useMemo(() => {
    if (!balanceData || balanceData.length === 0)
      return { chartData: [], methods: [], averages: {} };

    const dates = [...new Set(balanceData.map((d) => d.Date))];
    const methods = [...new Set(balanceData.map((d) => d["Payment method"]))];

    const chartData = dates.map((date) => {
      const row = { date };
      methods.forEach((method) => {
        const count = balanceData.filter(
          (d) => d.Date === date && d["Payment method"] === method
        ).length;
        row[method] = count;
      });
      return row;
    });

    const averages = {};
    methods.forEach((method) => {
      const total = balanceData.filter((d) => d["Payment method"] === method)
        .length;
      averages[method] = total / dates.length;
    });

    return { chartData, methods, averages };
  }, [balanceData]);

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ff7300",
    "#ff0000",
    "#00bcd4",
    "#8bc34a",
    "#ffc107",
    "#e91e63",
  ];

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 p-5 rounded-xl shadow transition-colors ${
        isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* LEFT: Chart Section */}
      <div className="flex-1 h-80 md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#444" : "#ccc"}
            />
            <XAxis
              dataKey="date"
              hide
              stroke={isDark ? "#eee" : "#333"}
            />
            <YAxis hide stroke={isDark ? "#eee" : "#333"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#333" : "#fff",
                borderColor: isDark ? "#555" : "#ccc",
                color: isDark ? "#fff" : "#000",
              }}
            />
            {methods.map((method, i) => (
              <Line
                key={method}
                type="monotone"
                dataKey={method}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RIGHT: Stats Section */}
      <div
        className={`w-full md:w-72 p-4 rounded-lg flex-shrink-0 transition-colors ${
          isDark
            ? "bg-gray-700 border border-gray-600"
            : "bg-gray-100 border border-gray-300"
        }`}
      >
        <h3 className="font-semibold text-lg mb-3">Insights (Main A/C)</h3>

        {/* Average Section */}
        <div>
          <h4 className="font-medium mb-2">Average Transactions</h4>

          <div className="space-y-2">
            {methods.map((method, i) => (
              <div
                key={method}
                className={`flex items-center justify-between p-2 rounded-md shadow-sm transition-colors ${
                  isDark
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: "14px",
                      height: "4px",
                      backgroundColor: colors[i % colors.length],
                      display: "inline-block",
                    }}
                  ></span>
                  <span className="text-sm">{method}</span>
                </div>
                <span className="font-semibold text-sm">
                  {averages[method].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsType;
