import ErrorCodes from "../middleWares/ErrorCodes.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

async function PaymentStatusCheck(request, response) {
  const { school_id } = request.query;
  const { collect_request_id } = request.params;

  try {
    const payload = { school_id, collect_request_id };
    const Payment_Gateway_Jwt = JWT.sign(payload, process.env.PG_SECRET_KEY);

    const url = `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${school_id}&sign=${Payment_Gateway_Jwt}`;

    const Payment_Gateway_Response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = Payment_Gateway_Response.data;

    const result = {
      status: data.status,
      amount: data.amount,
      details: {
        payment_methods: data.payment_methods || data.Payment_methods || null,
      },
      jwt: data.jwt,
    };

    return response.status(200).json({ success: true, PaymentLink: result });
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      success: false,
      message: "Failed to Check payment Status",
      error: error.response?.data || error.message,
    });
  }
}

export default PaymentStatusCheck;
