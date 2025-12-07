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

function BalanceDashboard({ data }) {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

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

  return (
    <div className="flex gap-4">
      {/* Left: Chart */}
      <div className="bg-white p-4 rounded-xl shadow flex-1">
        {/* <h2 className="text-xl font-semibold mb-2">Cumulative Balance Over Time</h2> */}
        <h2 className="text-xl font-semibold mb-2">Main A/C Activity</h2>
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
            <Line type="monotone" dataKey="Balance" stroke="#4B7BEC" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        {/* Button to open table modal */}
        <div className="mt-4 text-right">
          <button
            onClick={() => setIsTableModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Table
          </button>
        </div>
      </div>
      {/* Modal for table */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Balance Changes</h2>

            {/* Close Button */}
            <button
              onClick={() => setIsTableModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ×
            </button>

            {/* Scrollable Table */}
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
                      <td className={`px-4 py-2 text-sm ${d.Difference < 0 ? "text-red-600" : "text-green-600"}`}>
                        {d.Difference.toLocaleString("en-IN")}
                      </td>
                      <td className={`px-4 py-2 text-sm ${d.PercentChange < 0 ? "text-red-600" : "text-green-600"}`}>
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