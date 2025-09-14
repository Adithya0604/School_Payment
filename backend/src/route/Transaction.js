import express from "express";
import { Transaction, TransactionSchool, TransactionStatus } from "../controllers/Transaction.js";
import { UserAuth } from "../middleWares/PaymentMiddleWare.js";

const router = express.Router();

// Transaction
router.get("/", UserAuth, Transaction);
router.get("/school/:schoolId", UserAuth, TransactionSchool);
router.get("/status/:custom_order_id", UserAuth, TransactionStatus);

export default router;