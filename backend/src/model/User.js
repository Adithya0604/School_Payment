import express from "express";
import mongoose from "mongoose";

const userCreationSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true, 
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
      lowercase: true, 
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address", 
      ],
    },
    Password: {
      type: String,
      required: true,
      select: false, 
    },
  },
  { timestamps: true }
);


const userConnect = mongoose.model("userConnect", userCreationSchema, "users");

export default userConnect;
