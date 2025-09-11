import ErrorCodes from "../middleWares/ErrorCodes.js";
import JWT from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// 1st API: Generate JWT sign from given payload
async function CreatePayment(request, response) {
  const { school_id, amount, callback_url, user_upi } = request.body;

  try {
    // Include user_upi in payload if present
    const payload = { school_id, amount, callback_url };
    if (user_upi) {
      payload.user_upi = user_upi;
    }

    // Sign JWT with PG secret key
    const sign = JWT.sign(payload, process.env.PG_SECRET_KEY);

    return response.status(200).json({ success: true, sign });
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      success: false,
      message: "Failed to create JWT sign",
      error: error.response?.data || error.message,
    });
  }
}

// 2nd API: Use payload & sign received from client to call payment gateway
async function PaymentFinal(request, response) {
  try {
    const { school_id, amount, callback_url, user_upi, sign } = request.body;

    // Validate that all required fields including sign are present
    if (!school_id || !amount || !callback_url || !sign) {
      return response.status(400).json({
        success: false,
        message: "Missing payload fields or sign in request body",
      });
    }

    // Build data object to send to payment gateway API
    const Payment_GateWay_Data = { school_id, amount, callback_url, sign };

    if (user_upi) {
      Payment_GateWay_Data.user_upi = user_upi;
    }

    // Call Payment Gateway API
    const Payment_GateWay_Response = await axios.post(
      "https://dev-vanilla.edviron.com/erp/create-collect-request",
      Payment_GateWay_Data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    // Extract response data
    const data = Payment_GateWay_Response.data;

    const paymentUrl =
      data.Collect_request_url || data.collect_request_url || null;

    const result = {
      collect_request_id: data.collect_request_id,
      payment_url: paymentUrl,
      sign: data.sign,
    };

    return response.status(200).json({ success: true, PaymentLink: result });
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      success: false,
      message: "Failed to create payment request",
      error: error.response?.data || error.message,
    });
  }
}

export { CreatePayment, PaymentFinal };
