import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    trustee_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    student_info: {
      name: String,
      id: String,
      email: String,
    },
    gateway_name: {
      type: String,
      default: "Edviron",
    },
    collect_request_id: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema, "orders");

export default Order;
