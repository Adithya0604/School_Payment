const express = require("express");
const { default: mongoose } = require("mongoose");

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
      required: true,
    },
    transaction_amount: {
      type: Number,
      required: true,
    },
    payment_mode: {
      type: String,
      required: true,
    },
    payment_details: {
      type: String,
    },
    bank_reference: {
      type: String,
      required: true,
    },
    payment_message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      index: true,
    },
    error_message: {
      type: String,
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

module.exports = { OrderStatus };
