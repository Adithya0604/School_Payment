import React, { useState } from "react";
import FormError from "../components/FormError";
import { userPayment } from "../features/auth/authapi";
import PaymentStatus from "./PaymentStatus";

function Pay() {
  const [formData, setFormData] = useState({
    school_id: "",
    amount: "",
    name: "",
    id: "",
    trustee_id: "",
    email: "",
    user_upi: "",
    callback_url: "https://www.google.com",
  });

  const [error, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [collectRequestId, setCollectRequestId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newError = {};
    for (let field in formData) {
      if (!formData[field]) {
        newError[field] = `${field} is required`;
      }
    }

    if (Object.keys(newError).length > 0) {
      setErrors(newError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await userPayment(formData);

      if (response.success === true) {
        alert("Directing Payment...");

        const paymentUrl = response.PaymentLink?.payment_url;
        const collect_request_id = response.PaymentLink?.collect_request_id;
        if (paymentUrl) {
          window.open(paymentUrl, "_blank", "noopener,noreferrer");
        } else {
          setErrors({ api: "Payment URL not found" });
        }

        if (collect_request_id) {
          setCollectRequestId(collect_request_id);
        }
      } else {
        setErrors({
          api:
            response.MissingFields || response.message || response.ExistedUser,
        });
      }
    } catch (error) {
      setErrors({
        api: `Payment failed. Please try again. ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, #root {
            height: 100%;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #2a9d8f 0%, #264653 100%);
            color: #f0f4f8;
            font-size: 14px;
          }
          .page-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            width: 100%;
          }
          .form-container {
            background: #1d3557;
            width: 450px;
            padding: 30px 40px;
            border-radius: 14px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          }
          form > div {
            margin-bottom: 16px;
          }
          label {
            font-weight: 600;
            display: block;
            margin-bottom: 6px;
            color: #a8dadc;
            font-size: 13px;
            letter-spacing: 0.5px;
          }
          input[type="text"],
          input[type="email"] {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            border: 2px solid #457b9d;
            font-size: 14px;
            background-color: #457b9d;
            color: #f1faee;
            transition: border-color 0.3s ease, background-color 0.3s ease;
          }
          input[type="text"]:focus,
          input[type="email"]:focus {
            outline: none;
            border-color: #e63946;
            background-color: #a8dadc;
            color: #1d3557;
            box-shadow: 0 0 6px #e63946;
          }
          input[readonly] {
            background-color: #2a9d8f;
            cursor: not-allowed;
          }
          .error-message {
            color: #f94144;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 600;
          }
          .api-error {
            background-color: #f94144;
            color: #fff;
            padding: 12px;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 16px;
            font-size: 13px;
          }
          button {
            width: 50%;
            padding: 12px;
            font-size: 15px;
            background: #e76f51;
            color: white;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          button:hover:enabled {
            background-color: #f28482;
            box-shadow: 0 6px 18px rgba(231, 111, 81, 0.7);
          }
          button:disabled {
            background-color: #a8dadc;
            cursor: not-allowed;
            box-shadow: none;
            color: #333;
          }
        `}
      </style>

      <div className="page-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit} method="post" noValidate>
            <h2
              style={{
                marginBottom: "16px",
                color: "White",
                textAlign: "center",
              }}
            >
              Transfer Payment
            </h2>
            <div>
              <label htmlFor="school_id">School ID</label>
              <input
                type="text"
                id="school_id"
                name="school_id"
                onChange={handleChange}
                value={formData.school_id}
                required
              />
              <FormError error={error.school_id} />
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="text"
                id="amount"
                name="amount"
                onChange={handleChange}
                value={formData.amount}
                required
              />
              <FormError error={error.amount} />
            </div>

            <div>
              <label htmlFor="callback_url">CallBack Url</label>
              <input
                type="text"
                id="callback_url"
                name="callback_url"
                value={formData.callback_url}
                readOnly
              />
            </div>

            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                required
              />
              <FormError error={error.name} />
            </div>

            <div>
              <label htmlFor="id">Id</label>
              <input
                type="text"
                id="id"
                name="id"
                onChange={handleChange}
                value={formData.id}
                required
              />
              <FormError error={error.id} />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <FormError error={error.email} />
            </div>

            <div>
              <label htmlFor="trustee_id">Trustee Id</label>
              <input
                type="text"
                id="trustee_id"
                name="trustee_id"
                onChange={handleChange}
                value={formData.trustee_id}
                required
              />
              <FormError error={error.trustee_id} />
            </div>

            <div>
              <label htmlFor="user_upi">User UPI</label>
              <input
                type="text"
                id="user_upi"
                name="user_upi"
                onChange={handleChange}
                value={formData.user_upi}
              />
              <FormError error={error.user_upi} />
            </div>

            {error.api && <div className="api-error">{error.api}</div>}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting ..." : "Submit"}
            </button>

            {collectRequestId && (
              <PaymentStatus
                collect_request_id={collectRequestId}
                school_id={formData.school_id}
              />
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Pay;
