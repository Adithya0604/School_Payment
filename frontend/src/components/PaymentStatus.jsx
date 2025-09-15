import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentStatus({ collect_request_id, school_id }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let pollingInterval;

    async function checkStatus() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/PaymentStatusCheck/${collect_request_id}?school_id=${school_id}`,
          { withCredentials: true }
        );

        const currentStatus = response.data.PaymentLink?.status || "Pending";
        setStatus(currentStatus);

        if (currentStatus === "SUCCESS" || currentStatus === "NOT INITIATED") {
          clearInterval(pollingInterval);

          await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/updateOrderStatusFromPaymentStatus/${collect_request_id}?school_id=${school_id}`,
            { withCredentials: true }
          );

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } catch (error) {
        clearInterval(pollingInterval);
        setStatus("FAILED");
        console.error("Error fetching payment status:", error.message);
      }
    }

    if (collect_request_id && school_id) {
      checkStatus();

      pollingInterval = setInterval(checkStatus, 3000);
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [collect_request_id, school_id, navigate]);

  return (
    <>
      {status === null && <p>Checking Payment Status...</p>}
      {status === "SUCCESS" && <p>Payment Successful</p>}
      {status === "FAILED" && <p>Payment Failed</p>}
      {status === "Pending" && <p>Payment Pending...</p>}
    </>
  );
}

export default PaymentStatus;
