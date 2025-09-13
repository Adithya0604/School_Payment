// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// // import cors from "cors";
// import express from "express";
// // import cookieParser from "cookie-parser";

// import Connect from "./src/connection.js";
// import errorHandle from "./src/middleWares/UseErrorHandler.js";
// import UserRouter from "./src/route/User.js";
// import { PaymentRouter } from "./src/route/Payment.js";
// import PaymentStatusRouter from "./src/route/PaymentStatus.js";
// import { WebHookRouter } from "./src/route/WebHook.js";
// import TransactionRouter from "./src/route/Transaction.js";

// dotenv.config();

// const PORT = process.env.PORT;

// Connect();

// const app = express();
// app.use(bodyParser.json());

// app.use(express.json());
// // app.use(cookieParser());

// app.use("/api/user/", UserRouter);
// app.use("/api/user/", PaymentRouter);
// app.use("/api/user/", TransactionRouter);
// app.use("/api/user/", PaymentStatusRouter);
// app.use("/api/", WebHookRouter);

// app.use(errorHandle);

// app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

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

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, // if you want to allow cookies/auth headers
  })
);

// Mount routers
app.use("/api/user/", UserRouter); // existing user routes
app.use("/api/user/", PaymentRouter); // payment routes
app.use("/api/user/", transactionRouter); // ✅ transaction routes
app.use("/api/user/", PaymentStatusRouter); // payment status
app.use("/api/", WebHookRouter); // webhook routes

// Error handler
app.use(errorHandle);

// Start server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
