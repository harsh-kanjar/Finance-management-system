import React from "react";
import {
  FaCalendarAlt,
  FaList,
  FaEdit,
  FaMoneyBillWave,
  FaDollarSign,
  FaExchangeAlt,
  FaStickyNote,
} from "react-icons/fa";

function AddRecord() {
  // Today’s date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Groceries",
    "Fuel",
    "Investment",
  ];

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gradient-to-br from-gray-100 to-gray-300">

      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaEdit className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
            Add New Record
          </h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Date */}
          <div>
            <label className="label-custom">
              <FaCalendarAlt className="icon-custom text-blue-500" /> Date
            </label>
            <input
              type="date"
              defaultValue={today}
              className="input-custom"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="label-custom">
              <FaList className="icon-custom text-green-500" /> Category
            </label>
            <select className="input-custom">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="label-custom">
              <FaEdit className="icon-custom text-purple-500" /> Description
            </label>
            <input
              type="text"
              placeholder="Short description"
              className="input-custom"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="label-custom">
              <FaMoneyBillWave className="icon-custom text-yellow-500" /> Payment Method
            </label>
            <select className="input-custom">
              <option value="">Select</option>
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>UPI</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="label-custom">
              <FaDollarSign className="icon-custom text-red-500" /> Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="input-custom"
            />
          </div>

          {/* Type */}
          <div>
            <label className="label-custom">
              <FaExchangeAlt className="icon-custom text-indigo-500" /> Type
            </label>
            <select className="input-custom">
              <option>Expense</option>
              <option>Income</option>
            </select>
          </div>

          {/* Balance */}
          <div>
            <label className="label-custom">
              <FaDollarSign className="icon-custom text-teal-500" /> Balance After Transaction
            </label>
            <input
              type="number"
              placeholder="Auto or manual"
              className="input-custom"
            />
          </div>

          {/* Note */}
          <div className="md:col-span-2">
            <label className="label-custom">
              <FaStickyNote className="icon-custom text-pink-500" /> Note
            </label>
            <textarea
              rows={3}
              placeholder="Optional notes..."
              className="input-custom"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>

      {/* Utility styles using Tailwind (no inline <style> needed) */}
      <style>{`
        .label-custom {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .input-custom {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
        }
        .input-custom:focus {
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }
        .icon-custom {
          font-size: 1.1rem;
        }
      `}</style>

    </div>
  );
}

export default AddRecord;
