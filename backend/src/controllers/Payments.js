import JWT from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import  Order  from "../model/Order.js";
dotenv.config();

// Unified API: Create Order + Payment Link
async function CreatePaymentAndLink(req, res) {
  const {
    school_id,
    trustee_id,
    amount,
    callback_url,
    user_upi,
    name,
    email,
    id,
  } = req.body;

  try {
    if (
      !school_id ||
      !trustee_id ||
      !amount ||
      !callback_url ||
      !name ||
      !email ||
      !id
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2️⃣ Save order info locally
    const student_info = { name, id, email };
    const order = new Order({
      school_id,
      trustee_id,
      student_info,
      gateway_name: "Edviron",
    });
    await order.save();


    const payload = { school_id, amount, callback_url };
    if (user_upi) payload.user_upi = user_upi;
    const sign = JWT.sign(payload, process.env.PG_SECRET_KEY);

    const { data } = await axios.post(
      "https://dev-vanilla.edviron.com/erp/create-collect-request",
      { ...payload, sign },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const collect_request_id = data.collect_request_id;
    const paymentUrl =
      data.collect_request_url || data.Collect_request_url || null;


    order.collect_request_id = collect_request_id;
    await order.save();

    
    return res.status(200).json({
      success: true,
      order_id: order._id,
      PaymentLink: {
        collect_request_id,
        payment_url: paymentUrl,
        sign: data.sign,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order/payment link",
      error: error.response?.data || error.message,
    });
  }
}

export default CreatePaymentAndLink;
