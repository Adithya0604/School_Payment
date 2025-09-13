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
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          body, html, #root {
            height: 100%;
            margin: 10;
            padding: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background-color: #2F4858; /* Single solid color */
            color: #E1EDE6;
            font-size: 14px;
          }
          .page-wrapper {
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .button-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            align-items: center;
          }
          button {
            background-color: #39603D;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 15px rgba(57, 96, 61, 0.5);
            user-select: none;
          }
          button:hover {
            background-color: #456E43;
            box-shadow: 0 8px 25px rgba(69, 110, 67, 0.7);
          }
          button:focus {
            outline: none;
            box-shadow: 0 0 6px #79A19B;
          }
          @media (max-width: 480px) {
            .button-group {
              flex-direction: column;
              width: 100%;
            }
            button {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="page-wrapper">
        <div className="button-group">
          <button onClick={handlePayment} type="button">
            Pay
          </button>
          <button onClick={handleViewTransaction} type="button">
            View Transaction
          </button>
          <button onClick={handleLogOut} type="button">
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
