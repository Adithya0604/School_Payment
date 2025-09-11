import dotenv from "dotenv";
// import cors from "cors";
import express from "express";
// import cookieParser from "cookie-parser";

import Connect from "./src/connection.js";
import errorHandle from "./src/middleWares/UseErrorHandler.js";
import UserRouter from "./src/route/User.js";
import { PaymentRouter } from "./src/route/Payment.js";
import PaymentStatusRouter from "./src/route/PaymentStatus.js";

dotenv.config();

const PORT = process.env.PORT;

Connect();

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173", // your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
//     credentials: true, // if you want to allow cookies/auth headers
//   })
// );

app.use(express.json());
// app.use(cookieParser());

app.use("/api/user/", UserRouter);
app.use("/api/user/", PaymentRouter);
app.use("/api/user/", PaymentStatusRouter);

app.use(errorHandle);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
