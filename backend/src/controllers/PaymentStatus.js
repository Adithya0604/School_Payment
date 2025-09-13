import ErrorCodes from "../middleWares/ErrorCodes.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import Order from "../model/Order.js";
import OrderStatus from "../model/OrderStatus.js";

dotenv.config();

async function PaymentStatusCheck(request, response) {
  const { school_id } = request.query;
  const { collect_request_id } = request.params;

  try {
    if (request.path.includes("PaymentStatusCheck")) {
      const payload = { school_id, collect_request_id };
      const Payment_Gateway_Jwt = JWT.sign(payload, process.env.PG_SECRET_KEY);

      const url = `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${school_id}&sign=${Payment_Gateway_Jwt}`;

      const Payment_Gateway_Response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        timeout: 4000,
      });

      const data = Payment_Gateway_Response.data;

      return response.status(200).json({ success: true, PaymentLink: data });
    }

    if (request.path.includes("updateOrderStatusFromPaymentStatus")) {
      const url = `http://localhost:9003/api/user/PaymentStatusCheck/${collect_request_id}?school_id=${school_id}`;
      const apiResponse = await axios.get(url, { timeout: 4000 });

      if (!apiResponse.data.success) {
        return response.status(500).json({
          error: "PaymentStatusCheck API call failed",
          message: apiResponse.data.message,
        });
      }

      const paymentStatus = apiResponse.data.PaymentLink;
      const order = await Order.findOne({ collect_request_id });

      if (!order) {
        return response
          .status(ErrorCodes.Not_Found)
          .json({ error: "Order not found" });
      }

      await OrderStatus.create({
        collect_id: order._id,
        order_amount: paymentStatus?.amount || null,
        transaction_amount: paymentStatus?.transaction_amount || null,
        payment_mode: paymentStatus?.details?.payment_mode || null,
        payment_details: paymentStatus?.details || null,
        bank_reference: paymentStatus?.details?.bank_ref || null,
        payment_message:
          paymentStatus?.status === "SUCCESS"
            ? "Payment successful"
            : "Payment failed or pending",
        status: paymentStatus?.status,
        error_message:
          paymentStatus?.status === "SUCCESS"
            ? null
            : paymentStatus?.error_message || "Payment failed",
        payment_time: new Date().toISOString(),
      });

      const webhookpayload = {
        status: paymentStatus?.status === "SUCCESS" ? 200 : 400,
        order_info: {
          collect_request_id: order.collect_request_id,
          order_id: order._id,
          order_amount: paymentStatus?.amount || null,
          transaction_amount: paymentStatus?.transaction_amount || null,
          gateway: "Edviron",
          bank_reference: paymentStatus?.details?.bank_ref || "N/A",
          status: paymentStatus?.status,
          payment_mode: paymentStatus?.details?.payment_mode || "N/A",
          payment_details: JSON.stringify(paymentStatus?.details) || {},
          payment_message:
            paymentStatus?.status === "SUCCESS"
              ? "Payment Success"
              : "Payment Failed",
          payment_time: new Date().toISOString(),
          error_message:
            paymentStatus?.status === "SUCCESS"
              ? null
              : paymentStatus?.error_message || "Payment Failed",
        },
      };

      response
        .status(200)
        .json({ message: "Order status updated successfully" });

      (async () => {
        try {
          await axios.post(
            "http://localhost:9003/api/webhook",
            webhookpayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 6000,
            }
          );
        } catch (error) {
          return response
            .status(ErrorCodes.Bad_Request)
            .json({ success: false, message: `Error ${error.message}` });
        }
      })();

      return;
    }

    return response
      .status(ErrorCodes.Bad_Request)
      .json({ error: "Invalid request path" });
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      success: false,
      message: "Failed to Check payment Status",
      error: error.response?.data || error.message,
    });
  }
}

export default PaymentStatusCheck;
