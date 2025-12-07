import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import {AddRecord, Login, Register} from "./pages";
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
      </Routes>
      </BrowserRouter>
   
   </>
  );
}

export default App;
