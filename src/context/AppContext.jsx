import { createContext, useContext, useState, useEffect, useMemo } from "react";
import * as d3 from "d3";
import axios from "axios";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [balanceData, setBalanceData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [spendData, setSpendData] = useState([]);
  const [sipData, setSipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [essentials, setEssentials] = useState(null);




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
  console.log("AppContext rendered");
  console.log(essentials)
  /* ===============================
     Load data
  ================================ */
  useEffect(() => {
    const loadTSVFiles = async () => {
      try {
        const [b, s, sp, sip] = await Promise.all([
          d3.tsv("/kotak.tsv"),
          d3.tsv("/savings.tsv"),
          d3.tsv("/spend.tsv"),
          d3.tsv("/sips.tsv"),
        ]);

        setBalanceData(b);
        setSavingsData(s);
        setSpendData(sp);
        setSipData(sip);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTSVFiles();
  }, []);

  /* ===============================
     Derived values (MEMOIZED)
  ================================ */

  const savingsBalance = useMemo(() => {
    if (!savingsData.length) return 0;
    const last = savingsData[savingsData.length - 1];
    return parseFloat(
      String(last["Balance after spend (INR)"]).replace(/,/g, "")
    ) || 0;
  }, [savingsData]);

  const primaryBalance = useMemo(() => {
    if (!balanceData.length) return 0;
    const last = balanceData[balanceData.length - 1];
    return parseFloat(
      String(last["Balance after spend (INR)"]).replace(/,/g, "")
    ) || 0;
  }, [balanceData]);

  const latestSpendBalance = useMemo(() => {
    if (!spendData.length) return 0;

    const last = spendData[spendData.length - 1];
    const balanceKey = Object.keys(last).find(
      k => k.trim() === "Balance after transaction"
    );

    if (!balanceKey) return 0;

    return (
      parseFloat(String(last[balanceKey]).replace(/,/g, "")) || 0
    );
  }, [spendData]);

  const currentMonthSavings = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();

    return savingsData.reduce((sum, entry) => {
      if (!entry.Date) return sum;

      const [dd, mm, yyyy] = entry.Date.split("-").map(Number);
      if (mm - 1 === m && yyyy === y) {
        return (
          sum +
          (parseFloat(String(entry["Amount (INR)"]).replace(/,/g, "")) || 0)
        );
      }
      return sum;
    }, 0);
  }, [savingsData]);

  const typeTotals = useMemo(() => {
    const totals = {};
    let loanGiven = 0;
    let lendReturn = 0;

    balanceData.forEach(entry => {
      const type = entry.Type?.trim();
      const category = entry.Category?.trim();
      if (!type || type === "Income" || type === "Nothing") return;
      if (category === "Transfer") return;

      const amount =
        parseFloat(String(entry["Amount (INR)"]).replace(/,/g, "")) || 0;

      if (type === "Lend") {
        if (category === "Loan Given") loanGiven += amount;
        else if (category === "Lend Return") lendReturn += amount;
      } else {
        totals[type] = (totals[type] || 0) + amount;
      }
    });

    totals["Lend"] = loanGiven - lendReturn;
    return totals;
  }, [balanceData]);

  return (
    <AppContext.Provider
      value={{
        balanceData,
        savingsData,
        spendData,
        sipData,
        loading,
        isDark,
        setIsDark,
        essentials,

        // derived
        savingsBalance,
        primaryBalance,
        latestSpendBalance,
        currentMonthSavings,
        typeTotals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);