import express from "express";
import {
  UserAuth,
  CreatePaymentMiddleWare,
} from "../middleWares/PaymentMiddleWare.js";
import CreatePaymentAndLink from "../controllers/Payments.js";

const PaymentRouter = express.Router();

//Payment
PaymentRouter.post(
  "/payment",
  CreatePaymentMiddleWare,
  CreatePaymentAndLink
);

export { PaymentRouter };
