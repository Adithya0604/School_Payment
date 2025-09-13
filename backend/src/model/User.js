const express = require("express");
const { default: mongoose } = require("mongoose");

const userCreationSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true, // ✅ Removes extra spaces
    },
    LastName: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ✅ Emails are case-insensitive
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address", // ✅ Basic validation
      ],
    },
    Password: {
      type: String,
      required: true,
      select: false, // ✅ Hide password by default in queries
    },
  },
  { timestamps: true }
);

// ✅ Index for faster lookup by email
userCreationSchema.index({ Email: 1 }, { unique: true });

const userConnect = mongoose.model("userConnect", userCreationSchema, "users");

module.exports = { userConnect };
