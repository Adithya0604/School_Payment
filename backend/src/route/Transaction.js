import express from "express";
import { Transaction, TransactionSchool, TransactionStatus } from "../controllers/Transaction.js";

const router = express.Router();

// Transaction
router.get("/", Transaction);
router.get("/school/:schoolId", TransactionSchool);
router.get("/status/:custom_order_id", TransactionStatus);

export default router;