import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

import Connect from "./src/connection.js";
import errorHandle from "./src/middleWares/UseErrorHandler.js";
import UserRouter from "./src/route/User.js";
import { PaymentRouter } from "./src/route/Payment.js";
import PaymentStatusRouter from "./src/route/PaymentStatus.js";
import { WebHookRouter } from "./src/route/WebHook.js";
import transactionRouter from "./src/route/Transaction.js";

dotenv.config();
const PORT = process.env.PORT || 9003;

Connect();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Mount routers
app.use("/api/user/", UserRouter);
app.use("/api/user/", PaymentRouter);
app.use("/api/user/", transactionRouter);
app.use("/api/user/", PaymentStatusRouter);
app.use("/api/", WebHookRouter);

// Error handler
app.use(errorHandle);

// http calls --> https calls (converter)
// app.use((req, res, next) => {
//   if (req.secure || req.headers["x-forwarded-proto"] === "https") return next();
//   res.redirect(`https://${req.headers.host}${req.url}`);
// });

// Start server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
