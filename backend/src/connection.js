import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.MongoDB_URI;

async function Connect() {
  try {
    const conn = await mongoose.connect(URL, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default Connect;
