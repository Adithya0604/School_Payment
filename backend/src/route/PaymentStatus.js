import express from "express";
import PaymentStatusCheck from "../controllers/PaymentStatus.js";
import PaymentStatusMiddleWare from "../middleWares/UsePaymentStatus.js";
import { UserAuth } from "../middleWares/PaymentMiddleWare.js";

const PaymentStatusRouter = express.Router();

//Payment Status
PaymentStatusRouter.get(
  "/PaymentStatusCheck/:collect_request_id",
  UserAuth,
  PaymentStatusMiddleWare,
  PaymentStatusCheck
);

//Update Model With Payment Status
PaymentStatusRouter.get(
  "/updateOrderStatusFromPaymentStatus/:collect_request_id",
  UserAuth,
  PaymentStatusMiddleWare,
  PaymentStatusCheck
);

export default PaymentStatusRouter;
