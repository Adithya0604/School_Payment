import React from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../utils/fetchWithAuth";

const tokenFromStorage = localStorage.getItem("accessToken");
if (tokenFromStorage) {
  setAccessToken(tokenFromStorage);
}

function Dashboard() {
  const navigate = useNavigate();

  const handlePayment = () => navigate("/payment");
  const handleViewTransaction = () => navigate("/view-transaction");
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
      <button onClick={handlePayment}>Pay</button>
      <button onClick={handleViewTransaction}>View Transaction</button>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  );
}

export default Dashboard;
