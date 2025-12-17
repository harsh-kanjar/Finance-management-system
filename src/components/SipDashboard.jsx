import React, { useEffect, useState, useMemo } from "react";
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

const COLORS = ["#4B7BEC", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const SIPDashboard = () => {
  const { isDark } = useAppContext();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const loadTSV = async () => {
      const res = await fetch("/sips.tsv");
      const text = await res.text();
      setRows(parseTSV(text));
    };
    loadTSV();
  }, []);

  const toNumber = (v) => Number(String(v || "").replace(/,/g, "")) || 0;

  const parseTSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split("\t");

    return lines.slice(1).map((line) => {
      const values = line.split("\t");
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i] ? values[i].trim() : "";
      });

      obj.Fund = obj["Fund"] || obj["Fund Name"] || "";
      obj.Growth = toNumber(obj["Growth"]);
      obj.Amount = toNumber(obj["Amount"]);
      obj.Balance = toNumber(obj["Balance After Investment (INR)"]);
      obj.Units = toNumber(obj["Units Purchased"]);
      return obj;
    });
  };

  const fundNames = useMemo(
    () => [...new Set(rows.map((r) => r.Fund))].filter(Boolean),
    [rows]
  );

  const dates = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Date))].sort(
        (a, b) =>
          new Date(a.split("-").reverse().join("-")) -
          new Date(b.split("-").reverse().join("-"))
      ),
    [rows]
  );

  const buildChartData = (field) =>
    dates.map((date) => {
      const obj = { Date: date };
      fundNames.forEach((fund) => {
        const rec = rows.find((r) => r.Date === date && r.Fund === fund);
        obj[fund] = rec ? rec[field] : obj[fund] ?? 0;
      });
      return obj;
    });

  const growthData = useMemo(() => buildChartData("Growth"), [rows]);
  const balanceData = useMemo(() => buildChartData("Balance"), [rows]);
  const unitsData = useMemo(() => buildChartData("Units"), [rows]);

  const avgGrowthByFund = useMemo(() => {
    const res = {};
    fundNames.forEach((f) => {
      const vals = rows.filter((r) => r.Fund === f).map((r) => r.Growth);
      res[f] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    return res;
  }, [rows, fundNames]);

  const totalAmountByFund = useMemo(() => {
    const res = {};
    fundNames.forEach((f) => {
      res[f] = rows.filter((r) => r.Fund === f).reduce((a, b) => a + b.Amount, 0);
    });
    return res;
  }, [rows, fundNames]);

  const totalUnitsByFund = useMemo(() => {
    const res = {};
    fundNames.forEach((f) => {
      res[f] = rows.filter((r) => r.Fund === f).reduce((a, b) => a + b.Units, 0);
    });
    return res;
  }, [rows, fundNames]);

  if (!rows.length) return <p>Loading...</p>;

  const theme = {
    card: isDark
      ? "bg-gray-800 text-gray-100 border-gray-700"
      : "bg-white text-gray-800 border-gray-200",
    summaryCard: isDark
      ? "bg-gray-700 text-gray-100 border-gray-600"
      : "bg-gray-50 text-gray-800 border-gray-200",
    textMuted: isDark ? "text-gray-300" : "text-gray-500",
  };

  return (
    <div
      className={`flex flex-col gap-6 w-full p-2 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* ================== GRAPH 1 : GROWTH ================== */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className={`md:w-4/5 p-4 rounded-xl shadow border ${theme.card}`}>
          <h2 className="text-xl font-semibold mb-4">
            SIP & Lump Sum Growth Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#555" : "#e5e5e5"}
              />
              <XAxis dataKey="Date" hide />
              <YAxis unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }}
              />
              {fundNames.map((fund, i) => (
                <Line
                  key={fund}
                  dataKey={fund}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="md:w-1/5 flex flex-col gap-6">
          <div
            className={`p-5 rounded-xl shadow border ${theme.summaryCard}`}
          >
            <h3 className="text-lg font-semibold border-b pb-2">
              Growth Summary
            </h3>

            <div className="bg-green-50 text-green-800 p-3 rounded-xl text-center border border-green-200 shadow-sm font-bold mt-3">
              Overall Avg Growth:{" "}
              {(
                Object.values(avgGrowthByFund).reduce((a, b) => a + b, 0) /
                fundNames.length
              ).toFixed(2)}
              %
            </div>

            <h4 className="text-sm font-semibold opacity-80 border-b pb-1 mt-4">
              Fund-wise Avg Growth
            </h4>

            <div className="flex flex-col gap-2 mt-2">
              {fundNames.map((f) => (
                <div
                  key={f}
                  className={`flex justify-between p-2 rounded-lg border ${theme.summaryCard}`}
                >
                  <span className="text-sm">{f}</span>
                  <span className="font-semibold">
                    {avgGrowthByFund[f].toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-semibold opacity-80 border-b pb-1 mt-4">
              Color Legend
            </h4>

            <div className="flex flex-col gap-2 mt-2">
              {fundNames.map((f, i) => (
                <div key={f} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================== GRAPH 2 : BALANCE ================== */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className={`md:w-4/5 p-4 rounded-xl shadow border ${theme.card}`}>
          <h2 className="text-xl font-semibold mb-4">
            Balance After Investment (INR)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#555" : "#e5e5e5"}
              />
              <XAxis dataKey="Date" hide />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }}
              />
              {fundNames.map((fund, i) => (
                <Line
                  key={fund}
                  dataKey={fund}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`md:w-1/5 p-5 rounded-xl shadow border ${theme.summaryCard}`}
        >
          <h3 className="text-lg font-semibold border-b pb-2">
            Total Invested
          </h3>

          <div className="flex flex-col gap-3 mt-3">
            {fundNames.map((f) => (
              <div
                key={f}
                className={`flex justify-between p-2 rounded-lg border ${theme.summaryCard}`}
              >
                <span className="text-sm">{f}</span>
                <span className="font-semibold">
                  ₹{totalAmountByFund[f].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================== GRAPH 3 : UNITS ================== */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className={`md:w-4/5 p-4 rounded-xl shadow border ${theme.card}`}>
          <h2 className="text-xl font-semibold mb-4">Units Purchased</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={unitsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#555" : "#e5e5e5"}
              />
              <XAxis dataKey="Date" hide />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }}
              />
              {fundNames.map((fund, i) => (
                <Line
                  key={fund}
                  dataKey={fund}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`md:w-1/5 p-5 rounded-xl shadow border ${theme.summaryCard}`}
        >
          <h3 className="text-lg font-semibold border-b pb-2">
            Total Units
          </h3>

          <div className="flex flex-col gap-3 mt-3">
            {fundNames.map((f) => (
              <div
                key={f}
                className={`flex justify-between p-2 rounded-lg border ${theme.summaryCard}`}
              >
                <span className="text-sm">{f}</span>
                <span className="font-semibold">
                  {totalUnitsByFund[f].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIPDashboard;