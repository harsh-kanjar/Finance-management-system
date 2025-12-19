import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const AddSipRecord = () => {
  const { isDark } = useAppContext();

  const [essentials, setEssentials] = useState(null);
  const [formData, setFormData] = useState({
    "Fund Name": "",
    "Cap Name": "",
    "Investment Type": "",
    "Amount": "",
    "Units Purchased": "",
    "NAV (INR)": "",
    "Payment Method": "",
    "Date": "",
    "Notes": "",
  });

  // Fetch essentials
  useEffect(() => {
    const fetchEssentials = async () => {
      try {
        const res = await axios.get("http://localhost:3000/essentials", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6eyJ1c2VybmFtZSI6ImhhcnNoa2FuamFyMDdAZ21haWwuY29tIn0sImlhdCI6MTc2NTk5NzYzNH0.WKG3hVnBNIxLZr_d042vfxxtXdXuql0EbfYzpUwt_8A`,
          },
        });
        setEssentials(res.data);
      } catch (err) {
        console.error("Failed to fetch essentials:", err);
      }
    };
    fetchEssentials();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newData = { ...prev, [name]: value };

      // Calculate units if amount and NAV are present
      if (
        (name === "Amount" || name === "NAV (INR)") &&
        newData.Amount &&
        newData["NAV (INR)"]
      ) {
        newData["Units Purchased"] = (
          Number(newData.Amount) / Number(newData["NAV (INR)"])
        ).toFixed(2);
      }

      return newData;
    });
  };

  // Handle Fund Name selection (auto-fill amount, cap, payment method, date)
  const handleFundSelect = (e) => {
    const fund = e.target.value;
    if (!fund) return;

    const fundData = essentials?.Sip[fund];
    if (!fundData) return;

    const today = new Date();
    const currentMonthDay = fundData.date || today.getDate();

    setFormData((prev) => ({
      ...prev,
      "Fund Name": fund,
      Amount: fundData.amount,
      "Cap Name": fundData.cap,
      "Payment Method": fundData.paymentMethod,
      "Investment Type": fundData.investmentType,
      Date: `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(currentMonthDay).padStart(2, "0")}`,
      "Units Purchased": fundData.amount && prev["NAV (INR)"]
        ? (Number(fundData.amount) / Number(prev["NAV (INR)"])).toFixed(2)
        : "",
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/sip", formData, {
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6eyJ1c2VybmFtZSI6ImhhcnNoa2FuamFyMDdAZ21haWwuY29tIn0sImlhdCI6MTc2NTk5NzYzNH0.WKG3hVnBNIxLZr_d042vfxxtXdXuql0EbfYzpUwt_8A` },
      });
      alert(res.data);
      setFormData({
        "Fund Name": "",
        "Cap Name": "",
        "Investment Type": "",
        "Amount": "",
        "Units Purchased": "",
        "NAV (INR)": "",
        "Payment Method": "",
        Date: "",
        Notes: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add SIP record");
    }
  };

  return (
    <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
        <div
      className={`max-w-xl mx-auto p-6 pt-10 rounded-md shadow-md transition-colors duration-200 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Add SIP Record</h2>

      {!essentials ? (
        <p>Loading essentials...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fund Name */}
          <div>
            <label className="block font-medium mb-1">Fund Name</label>
            <select
              name="Fund Name"
              value={formData["Fund Name"]}
              onChange={handleFundSelect}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            >
              <option value="">Select Fund</option>
              {Object.keys(essentials.Sip).map((fund) => (
                <option key={fund} value={fund}>
                  {fund}
                </option>
              ))}
            </select>
          </div>

          {/* Cap Name */}
          <div>
            <label className="block font-medium mb-1">Cap Name</label>
            <input
              type="text"
              name="Cap Name"
              value={formData["Cap Name"]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          {/* Investment Type */}
          <div>
            <label className="block font-medium mb-1">Investment Type</label>
            <select
              name="Investment Type"
              value={formData["Investment Type"]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            >
              <option value="">Select Type</option>
              {Object.values(essentials["Investment Types"]).map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium mb-1">Amount (INR)</label>
            <input
              type="number"
              name="Amount"
              value={formData.Amount}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          {/* NAV */}
          <div>
            <label className="block font-medium mb-1">NAV (INR)</label>
            <input
              type="number"
              step="0.01"
              name="NAV (INR)"
              value={formData["NAV (INR)"]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          {/* Units Purchased */}
          <div>
            <label className="block font-medium mb-1">Units Purchased</label>
            <input
              type="number"
              name="Units Purchased"
              value={formData["Units Purchased"]}
              readOnly
              className={`w-full border rounded px-3 py-2 bg-gray-200 ${
                isDark ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <select
              name="Payment Method"
              value={formData["Payment Method"]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            >
              <option value="">Select Payment Method</option>
              {Object.values(essentials["Payment Methods"]).map((pm, idx) => (
                <option key={idx} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1">Notes</label>
            <input
              type="text"
              name="Notes"
              value={formData.Notes}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
          >
            Add SIP Record
          </button>
        </form>
      )}
    </div>
    </div>
  );
};

export default AddSipRecord;
