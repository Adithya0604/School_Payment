require("dotenv").config();
const mongoose = require("mongoose");

const URL = process.env.MongoDB_URI;

async function Connect() {
  try {
    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}


module.exports = Connect;