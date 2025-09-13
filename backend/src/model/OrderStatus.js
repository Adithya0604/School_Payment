import mongoose from "mongoose";

const OrderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
      index: true,
    },
    custom_order_id: {
      type: String,
      required: true,
      unique: true,
    },
    order_amount: {
      type: Number,
      required: false,
    },
    transaction_amount: {
      type: Number,
      required: false,
    },
    payment_mode: {
      type: String,
      required: false,
    },
    payment_details: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    bank_reference: {
      type: String,
      required: false,
    },
    payment_message: {
      type: String,
      required: false,
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
