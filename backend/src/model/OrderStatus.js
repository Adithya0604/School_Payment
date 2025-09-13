import mongoose from "mongoose";

const OrderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
      index: true,
    },
    order_amount: {
      type: Number,
      required: false, // Not always available for failed transactions
    },
    transaction_amount: {
      type: Number,
      required: false, // Same reason as above
    },
    payment_mode: {
      type: String,
      required: false, // Some gateways don't send mode if failed
    },
    payment_details: {
      type: mongoose.Schema.Types.Mixed, // ✅ can store JSON object or string safely
      required: false,
    },
    bank_reference: {
      type: String,
      required: false, // Some cases may not have reference
    },
    payment_message: {
      type: String,
      required: false, // Can be empty or missing for pending
    },
    status: {
      type: String,
      required: true,
      index: true,
    },
    error_message: {
      type: String,
      required: false,
    },
    payment_time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const OrderStatus = mongoose.model(
  "OrderStatus",
  OrderStatusSchema,
  "orderstatus"
);

export default OrderStatus;
