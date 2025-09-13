import express from "express";
import PaymentStatusCheck from "../controllers/PaymentStatus.js";
import PaymentStatusMiddleWare from "../middleWares/UsePaymentStatus.js";

const PaymentStatusRouter = express.Router();

// Define route with :collect_request_id as path parameter
PaymentStatusRouter.get(
  "/PaymentStatusCheck/:collect_request_id",
  PaymentStatusMiddleWare,
  PaymentStatusCheck
);

PaymentStatusRouter.get(
  "/updateOrderStatusFromPaymentStatus/:collect_request_id",
  PaymentStatusMiddleWare,
  PaymentStatusCheck
);

export default PaymentStatusRouter;
