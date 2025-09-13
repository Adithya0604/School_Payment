import React from "react";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../features/auth/authapi";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await userLogout();

    if (response.status === 200 && response.success) {
      alert("Logged out successfully!");
      navigate("/login");
    } else {
      alert(response.message || "Logout failed, please try again.");
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: "8px 20px" }}>
      Logout
    </button>
  );
}
