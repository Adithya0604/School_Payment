import express from "express";
import {
  UserAuth,
  CreatePaymentMiddleWare,
} from "../middleWares/PaymentMiddleWare.js";
import CreatePaymentAndLink from "../controllers/Payments.js";
import { UserAuth } from "../middleWares/PaymentMiddleWare.js";

const PaymentRouter = express.Router();

//Payment
PaymentRouter.post(
  "/payment",
  UserAuth,
  CreatePaymentMiddleWare,
  CreatePaymentAndLink
);

export { PaymentRouter };
