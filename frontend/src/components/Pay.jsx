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
      <div>
        <form onSubmit={handleSubmit} method="post">
          <div>
            <label htmlFor="school_id">School ID</label>
            <input
              type="text"
              id="school_id"
              name="school_id"
              onChange={handleChange}
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
              onChange={handleChange}
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
            />
            <FormError error={error.user_upi} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {isLoading ? "Submiting ..." : "Submited"}
          </button>

          {collectRequestId && (
            <PaymentStatus
              collect_request_id={collectRequestId}
              school_id={formData.school_id}
            />
          )}
        </form>
      </div>
    </>
  );
}

export default Pay;
