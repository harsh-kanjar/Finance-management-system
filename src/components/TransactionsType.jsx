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
  const { balanceData } = useAppContext();

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
      const total = balanceData.filter(
        (d) => d["Payment method"] === method
      ).length;

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
      className="w-full p-5 rounded-xl"
      style={{
        background: "white",
        display: "flex",
        gap: "20px",
      }}
    >
      {/* LEFT: Chart Section */}
      <div className="flex-1 h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis hide/>
            <Tooltip />

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
        className="w-[280px] p-4 rounded-lg"
        style={{
          background: "#f8f9fa",
          border: "1px solid #e2e2e2",
        }}
      >
        <h3 className="font-semibold text-lg mb-3">Insights (Main A/C)</h3>

        {/* Average Section */}
        <div>
          <h4 className="font-medium mb-2">Average Transactions</h4>

          <div className="space-y-2">
            {methods.map((method, i) => (
              <div
                key={method}
                className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
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

        {/* Legend */}
        {/* <div className="mt-4">
          <h4 className="font-medium mb-2">Color Legend</h4>

          {methods.map((method, i) => (
            <div key={method} className="flex items-center gap-2 mb-2">
              <span
                style={{
                  width: "20px",
                  height: "4px",
                  backgroundColor: colors[i % colors.length],
                  display: "inline-block",
                  borderRadius: "2px",
                }}
              ></span>
              <span className="text-sm">{method}</span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default TransactionsType;