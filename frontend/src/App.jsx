import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/register";
import Login from "./features/auth/login";
import Dashboard from "./features/Home/Dashboard";
import Pay from "./components/Pay";
import Transaction from "./components/Transaction";
import LogOut from "./components/LogOut";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Pay />} />
        <Route path="/view-transaction" element={<Transaction />} />
        <Route path="/logout" element={<LogOut />} />
      </Routes>
    </>
  );
}

export default App;
