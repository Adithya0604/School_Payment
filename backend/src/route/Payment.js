import express from "express";
import { UserAuth, CreatePaymentMiddleWare } from "../middleWares/PaymentMiddleWare.js";
import { CreatePayment, PaymentFinal } from "../controllers/Payments.js";

const PaymentRouter = express.Router();

PaymentRouter.post(
  "/payment",
  UserAuth,               
  CreatePaymentMiddleWare,
  CreatePayment
);

PaymentRouter.post(
  "/finalpayment",             
  CreatePaymentMiddleWare,
  PaymentFinal
);

export { PaymentRouter };
