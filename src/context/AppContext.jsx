import { createContext, useContext, useState, useEffect } from "react";
import * as d3 from "d3";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [balanceData, setBalanceData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [spendData, setSpendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTSVFiles = async () => {
      try {
        const [b, s, sp] = await Promise.all([
          d3.tsv("/kotak.tsv"),
          d3.tsv("/savings.tsv"),
          d3.tsv("/spend.tsv"),
        ]);

        setBalanceData(b);
        setSavingsData(s);
        setSpendData(sp);
      } catch (err) {
        console.error("Error loading TSV files:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTSVFiles();
  }, []);

  return (
    <AppContext.Provider
      value={{
        balanceData,
        savingsData,
        spendData,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
