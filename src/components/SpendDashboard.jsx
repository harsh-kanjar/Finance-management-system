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
import PocketMoneyCard from "./PocketMoneyCard";
import BalanceDashboard from "./BalanceDashboard";
import { useAppContext } from "../context/AppContext";

const SpendDashboard = () => {
    const [rows, setRows] = useState([]);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const { balanceData } = useAppContext();

    useEffect(() => {
        const loadTSV = async () => {
            try {
                const res = await fetch("/spend.tsv");
                const text = await res.text();
                setRows(parseTSV(text));
            } catch (err) {
                console.error("TSV LOAD ERROR:", err);
            }
        };
        loadTSV();
    }, []);

    const parseTSV = (text) => {
        const lines = text.trim().split("\n");
        const headers = lines[0].split("\t");
        return lines.slice(1).map((line) => {
            const values = line.split("\t");
            const obj = {};
            headers.forEach((h, i) => {
                obj[h.trim()] = values[i] ? values[i].trim() : "";
            });
            return obj;
        });
    };

    const {
        chartData,
        tableData,
        pocketMoney,
        totalSpendFromPocketMoney,
        avgDailySpend,
        avgTransaction,
        chartTrend,
        recommendedAvgDailySpend,
        daysUntilOut,
        avgTransactionsADay,
        recommendedAvgTransaction
    } = useMemo(() => {
        if (!rows || rows.length === 0)
            return {
                chartData: [],
                tableData: [],
                pocketMoney: 0,
                totalSpendFromPocketMoney: 0,
                avgDailySpend: 0,
                avgTransaction: 0,
                chartTrend: "flat",
                recommendedAvgDailySpend: 0,
                daysUntilOut: 0,
                avgTransactionsADay: 0,
                recommendedAvgTransaction:0
            };

        const parsed = rows.map((r) => {
            const balance = Number((r["Balance after transaction"] || "0").replace(/,/g, ""));
            const amount = Number((r.Amount || "0").replace(/,/g, ""));
            const [day, month, year] = r.Date.split("-");
            const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
            return { ...r, DateObj: dateObj, Balance: balance, AmountNum: amount };
        });

        parsed.sort((a, b) => a.DateObj - b.DateObj);

        const chartData = parsed.map((d) => ({ Date: d.Date, Balance: d.Balance }));

        const tableData = parsed.map((d, i, arr) => {
            let diff = 0,
                pct = 0;
            if (i > 0 && d.Type !== "Income") {
                const prev = arr[i - 1].Balance;
                diff = d.Balance - prev;
                pct = prev ? (diff / prev) * 100 : 0;
            }
            return { Date: d.Date, Balance: d.Balance, Diff: diff, PercentChange: pct, Type: d.Type };
        });

        // Pocket money and total spend
        const pocketMoney = parsed[parsed.length - 1]?.Balance || 0;
        const totalSpendFromPocketMoney = parsed
            .filter((r) => r.Category !== "Fund allotted")
            .reduce((sum, r) => sum + (r.AmountNum || 0), 0);

        // Average daily spend
        const firstDate = parsed[0]?.DateObj;
        const today = new Date();
        const daysDifference = Math.max(1, Math.floor((today - firstDate) / (1000 * 3600 * 24)) + 1);

        const filteredSpend = parsed.filter((r) => r.Type !== "Income" && r.Category !== "Fund allotted");
        const totalSpend = filteredSpend.reduce((sum, r) => sum + (r.AmountNum || 0), 0);

        const avgDailySpend = totalSpend / daysDifference;
        const avgTransaction = filteredSpend.length ? totalSpend / filteredSpend.length : 0;

        // Trend detection
        let chartTrend = "flat";
        if (chartData.length > 1) {
            const first = chartData[0].Balance;
            const last = chartData[chartData.length - 1].Balance;
            const diff = last - first;
            const pct = (diff / first) * 100;
            if (pct > 2) chartTrend = "up";
            else if (pct < -2) chartTrend = "down";
        }

        // Calculate remaining days in the current month (excluding today)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of the month
        const remainingDaysOfMonth = Math.max(1, endOfMonth.getDate() - today.getDate()); // exclude today

        // Calculate the recommended average daily spend
        const recommendedAvgDailySpend = pocketMoney / remainingDaysOfMonth;

        // Calculate the number of days until the pocket money runs out
        const daysUntilOut = avgDailySpend > 0
            ? Math.floor(pocketMoney / avgDailySpend)
            : 0;

        const avgTransactionsADay = filteredSpend.length / daysDifference;

        const recommendedAvgTransaction = recommendedAvgDailySpend / (avgTransactionsADay || 1);


        return {
            chartData,
            tableData,
            pocketMoney,
            totalSpendFromPocketMoney,
            avgDailySpend,
            avgTransaction,
            chartTrend,
            recommendedAvgDailySpend, // Added
            daysUntilOut, // Added
            avgTransactionsADay,
            recommendedAvgTransaction
        };
    }, [rows]);


    if (!rows || rows.length === 0) return <p>Loading TSV...</p>;

    return (
        <div className="flex flex-col gap-8">
            {/* Pocket Money Card */}
            <PocketMoneyCard pocketMoney={pocketMoney} totalSpendFromPocketMoney={totalSpendFromPocketMoney} />
 
            {/* Average Daily & Transaction Spend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`p-4 rounded-xl font-semibold border ${avgDailySpend > 100
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : avgDailySpend < 50
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-yellow-50 text-yellow-700 border-yellow-300"
                        }`}
                >
                    Average Daily Spend: ₹{avgDailySpend.toLocaleString("en-IN", { maximumFractionDigits: 2 })} -  <span>(Recommended <span className="px-2 py-1 rounded-md text-white bg-green-700"> ₹{recommendedAvgDailySpend.toFixed(2)}</span> )</span>

                    <div className="my-1">
                        <span>With an average daily spend of ₹{avgDailySpend.toLocaleString("en-IN", { maximumFractionDigits: 2 })} your money will run out in {daysUntilOut.toFixed(0)} Days</span>
                        <span> (on {new Date(new Date().setDate(new Date().getDate() + daysUntilOut)).toLocaleDateString()})</span>
                    </div>

                    <div className="text-sm mt-1 opacity-80">
                        {avgDailySpend > 100 && "Extremely high — Reduce spending immediately!"}
                        {avgDailySpend < 50 && "Great! Low daily spend."}
                        {avgDailySpend >= 50 && avgDailySpend <= 100 && "High spending — Monitor it."}
                    </div>
                </div>

                <div
                    className={`p-4 rounded-xl font-semibold border ${avgTransaction > 100
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : avgTransaction < 50
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-yellow-50 text-yellow-700 border-yellow-300"
                        }`}
                >
                    Average Transaction Amount: ₹{avgTransaction.toLocaleString("en-IN", { maximumFractionDigits: 2 })} -  <span>(Recommended <span className="px-2 py-1 rounded-md text-white bg-green-700"> ₹{recommendedAvgTransaction.toFixed(2)}</span> )</span>
                    <div className="my-1">
                        <p>Avg Transaction per day - {avgTransactionsADay.toFixed(2)}</p>
                    </div>
                    <div className="text-sm mt-1 opacity-80">
                        {avgTransaction > 100 && "Very high spend per transaction!"}
                        {avgTransaction < 50 && "Excellent — Low spend per txn."}
                        {avgTransaction >= 50 && avgTransaction <= 100 && "High — Monitor each transaction."}
                    </div>
                </div>
            </div>

            {/* Chart + Right Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Chart */}
                <div
                    className={`p-4 rounded-xl shadow border flex flex-col ${chartTrend === "up"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : chartTrend === "down"
                            ? "bg-red-50 border-red-300 text-red-700"
                            : "bg-yellow-50 border-yellow-300 text-yellow-700"
                        }`}
                >
                    <h2 className="text-xl font-semibold mb-2">
                        Balance After Transaction
                        <span className="block text-sm opacity-70 mt-1">
                            {chartTrend === "up" && "Positive Trend — Balance Increasing"}
                            {chartTrend === "down" && "Negative Trend — Balance Decreasing"}
                            {chartTrend === "flat" && "Stable Trend — No Major Change"}
                        </span>
                    </h2>

                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Date" tickFormatter={(v) => v.slice(0, 5)} />
                            <YAxis />
                            <Tooltip
                                formatter={(v) =>
                                    Number(v).toLocaleString("en-IN", { style: "currency", currency: "INR" })
                                }
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Line type="monotone" dataKey="Balance" stroke="#4B7BEC" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>

                    <div className="mt-4 text-right">
                        <button
                            onClick={() => setIsTableModalOpen(true)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            title="View Table"
                        >
                            📊
                        </button>
                    </div>
                </div>

                {/* Right placeholder */}
                <div>
                    <BalanceDashboard data={balanceData} />
                </div>
            </div>

            {/* Table Modal */}
            {isTableModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-auto p-4">
                    <div className="bg-white rounded-xl w-full max-w-6xl p-6 relative">
                        <h2 className="text-xl font-semibold mb-4">Daily Balance Summary</h2>

                        <button
                            onClick={() => setIsTableModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
                        >
                            ×
                        </button>

                        <div className="overflow-x-auto max-h-[70vh]">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Balance (INR)</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Difference (INR)</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">% Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tableData.map((d, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm">{d.Date}</td>
                                            <td className="px-4 py-2 text-sm">{d.Balance.toLocaleString("en-IN")}</td>
                                            <td className={`px-4 py-2 text-sm ${d.Diff >= 0 || d.Type === "Income" ? "text-green-600" : "text-red-600"}`}>
                                                {d.Diff.toLocaleString("en-IN")}
                                            </td>
                                            <td className={`px-4 py-2 text-sm ${d.PercentChange >= 0 || d.Type === "Income" ? "text-green-600" : "text-red-600"}`}>
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
};

export default SpendDashboard;