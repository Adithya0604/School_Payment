const Express = require("express");
const { default: mongoose } = require("mongoose");

const userCreationSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    LastName: {
      type: String,
      maxlength: 50,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
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

module.exports = { userConnect };
