import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PocketMoneyCard({ pocketMoney, totalSpendFromPocketMoney }) {
    const [showBalance, setShowBalance] = useState(false);
    const [showSpent, setShowSpent] = useState(false);

    // COLOR LOGIC FOR BALANCE
    let balanceColor = "";
    let balanceMsg = "";

    if (pocketMoney >= 2000 && pocketMoney <= 2500) {
        balanceColor = "bg-green-100 text-green-800 border-green-300";
        balanceMsg = "Great! Good buffer available.";
    } else if (pocketMoney >= 1500 && pocketMoney < 2000) {
        balanceColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
        balanceMsg = "Okay — Spend carefully.";
    } else if (pocketMoney >= 1000 && pocketMoney < 1500) {
        balanceColor = "bg-red-100 text-red-800 border-red-300";
        balanceMsg = "Low pocket money — Manage tightly.";
    } else if (pocketMoney >= 500 && pocketMoney < 1000) {
        balanceColor = "bg-purple-100 text-purple-800 border-purple-300";
        balanceMsg = "Very low — Try not to spend much.";
    } else {
        balanceColor = "bg-gray-100 text-gray-800 border-gray-300";
        balanceMsg = "Critical! Pocket money almost finished.";
    }

    // COLOR LOGIC FOR SPENT AMOUNT
    let spentColor = "";
    let spentMsg = "";

    if (totalSpendFromPocketMoney >= 0 && totalSpendFromPocketMoney < 1000) {
        spentColor = "bg-green-100 text-green-800 border-green-300";
        spentMsg = "Low spending so far.";
    } else if (totalSpendFromPocketMoney >= 1000 && totalSpendFromPocketMoney < 2000) {
        spentColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
        spentMsg = "Moderate spending — keep track.";
    } else if (totalSpendFromPocketMoney >= 2000 && totalSpendFromPocketMoney < 3000) {
        spentColor = "bg-red-100 text-red-800 border-red-300";
        spentMsg = "High spending — be cautious!";
    } else {
        spentColor = "bg-purple-100 text-purple-800 border-purple-300";
        spentMsg = "Very high spending!";
    }

    return (
        <div className="flex gap-4">
            {/* BALANCE CARD */}
            <div className={`flex-1 p-5 rounded-xl border ${balanceColor}`}>
                <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold">Pocket Money</p>
                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-xl opacity-70 hover:opacity-100"
                    >
                        {showBalance ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="mt-2 text-4xl font-bold select-none">
                    {showBalance ? `₹${pocketMoney.toLocaleString("en-IN")}` : "••••"}
                </div>
                <div className="text-sm mt-1 opacity-80">{balanceMsg}</div>
            </div>

            {/* SPENT CARD */}
            <div className={`flex-1 p-5 rounded-xl border ${spentColor}`}>
                <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold">Spent</p>
                    <button
                        onClick={() => setShowSpent(!showSpent)}
                        className="text-xl opacity-70 hover:opacity-100"
                    >
                        {showSpent ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="mt-2 text-4xl font-bold select-none">
                    {showSpent ? `₹${totalSpendFromPocketMoney.toLocaleString("en-IN")}` : "••••"}
                </div>
                <div className="text-sm mt-1 opacity-80">{spentMsg}</div>
            </div>
        </div>
    );
}