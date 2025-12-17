import React, { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../context/AppContext";

function StdDevChart({ balanceData }) {
  const { isDark } = useAppContext();
  const [includeSelfTransfers, setIncludeSelfTransfers] = useState(false);
  const [includeLend, setIncludeLend] = useState(false);
  const [includeHomeEssentials, setIncludeHomeEssentials] = useState(false);

  const { chartData, mean, stdDev } = useMemo(() => {
    if (!balanceData || balanceData.length === 0)
      return { chartData: [], mean: 0, stdDev: 0 };

    const normalize = (str) => str?.trim().toLowerCase();

    const filtered = balanceData
      .filter((d) => normalize(d.Type) !== "income")
      .filter(
        (d) => includeHomeEssentials || normalize(d.Type) !== "home essentials"
      )
      .filter((d) => includeLend || normalize(d.Type) !== "lend")
      .filter(
        (d) =>
          includeSelfTransfers ||
          d.Description !== "Bank Kotak - Bank SBI Self Transfer"
      )
      .map((d) => {
        const amount = +d["Amount (INR)"].replace(/,/g, "");
        const [day, month, year] = d.Date.split("-");
        return {
          ...d,
          Amount: amount,
          DateObj: new Date(`${year}-${month}-${day}`),
        };
      })
      .sort((a, b) => a.DateObj - b.DateObj);

    if (filtered.length === 0)
      return { chartData: [], mean: 0, stdDev: 0 };

    const amounts = filtered.map((d) => d.Amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance =
      amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) /
      amounts.length;
    const stdDev = Math.sqrt(variance);

    const chartData = filtered.map((d) => ({
      Date: d.Date,
      Amount: d.Amount,
      isOutlier: Math.abs(d.Amount - mean) > stdDev,
    }));

    return { chartData, mean, stdDev };
  }, [balanceData, includeSelfTransfers, includeLend, includeHomeEssentials]);

  if (!chartData.length)
    return (
      <p className={isDark ? "text-gray-300" : "text-gray-600"}>
        No data to display.
      </p>
    );

  return (
    <div
      className={`p-4 rounded-xl shadow w-full ${
        isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Header & Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Transaction Range</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSelfTransfers}
              onChange={() =>
                setIncludeSelfTransfers((prev) => !prev)
              }
              className="h-5 w-5 accent-blue-500"
            />
            <span className="text-sm">Include Self Transfers</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeLend}
              onChange={() => setIncludeLend((prev) => !prev)}
              className="h-5 w-5 accent-green-500"
            />
            <span className="text-sm">Include Lend</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeHomeEssentials}
              onChange={() =>
                setIncludeHomeEssentials((prev) => !prev)
              }
              className="h-5 w-5 accent-purple-500"
            />
            <span className="text-sm">Include Home Essentials</span>
          </label>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#e5e7eb"}
          />

          <XAxis
            dataKey="Date"
            type="category"
            name="Date"
            tickFormatter={(v) => v.slice(0, 2)}
            hide
          />
          <YAxis
            dataKey="Amount"
            type="number"
            name="Amount"
            tick={{ fill: isDark ? "#D1D5DB" : "#374151" }}
          />

          <Tooltip
            cursor={{ stroke: isDark ? "#6B7280" : "#D1D5DB" }}
            formatter={(value) =>
              value.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })
            }
            labelFormatter={(label) => `Date: ${label}`}
          />

          <ReferenceArea
            y1={mean - stdDev}
            y2={mean + stdDev}
            fill="#D1FAE5"
            fillOpacity={0.3}
          />

          <ReferenceLine
            y={mean}
            stroke="#10B981"
            strokeDasharray="3 3"
            label={{
              value: "Mean",
              position: "right",
              fill: isDark ? "#6EE7B7" : "#065F46",
            }}
          />

          <Scatter data={chartData} fill="#3B82F6">
            {chartData.map((entry, index) => (
              <circle
                key={index}
                cx={0}
                cy={0}
                r={entry.isOutlier ? 6 : 4}
                fill={entry.isOutlier ? "#EF4444" : "#3B82F6"}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <p className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        Zone: ±1 Standard Deviation (light green). Outliers shown in red.
      </p>
    </div>
  );
}

export default StdDevChart;