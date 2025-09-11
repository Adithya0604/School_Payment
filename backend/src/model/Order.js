const express = require("express");
const { default: mongoose } = require("mongoose");
const { type } = require("os");
const { ref } = require("process");

const OrderSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trustee_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    student_info: {
      name: string,
      id: string,
      email: string,
    },
    gateway_name: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema, "orders");

module.exports = { Order };
