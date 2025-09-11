const express = require("express");
const mongoose = require("mongoose");
const mongoose = require("mongoose");

const OrderInfoSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true },
    order_amount: { type: Number, required: true },
    transaction_amount: { type: Number, required: true },
    gateway: { type: String, required: true },
    bank_reference: { type: String, required: true },
    status: { type: String, required: true },
    payment_mode: { type: String, required: true },
    payemnt_details: { type: String },
    Payment_message: { type: String },
    payment_time: { type: Date, required: true },
    error_message: { type: String },
  },
  { _id: false }
);

const WebhookLogSchema = new mongoose.Schema(
  {
    status: { type: Number, required: true },
    order_info: { type: OrderInfoSchema, required: true },
  },
  { timestamps: true }
);

const WebhookLog = mongoose.model(
  "WebhookLog",
  WebhookLogSchema,
  "webhooklogs"
);

module.exports = { WebhookLog };
