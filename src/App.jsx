import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import {AccountsAnalysis, AddRecord, LendAnalysis, Login, Register,SipAnalysis, TransactionsAnalysis} from "./pages";
import { Navbar } from "./components";

function App() {
  return (
   <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-record" element={<AddRecord />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/invested" element={<SipAnalysis/>} />
        <Route path="/allTransactions" element={<TransactionsAnalysis/>} />
        <Route path="/accounts" element={<AccountsAnalysis/>} />
        <Route path="/lend" element={<LendAnalysis/>} />

      </Routes>
      </BrowserRouter>
   
   </>
  );
}

export default App;
