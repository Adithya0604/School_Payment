import express from "express";
import { WebHookStatus } from "../controllers/WebHooks.js";
import { UserAuth } from "../middleWares/PaymentMiddleWare.js";
const WebHookRouter = express.Router();

// POST webhook endpoint
WebHookRouter.post("/webhook", WebHookStatus);

export { WebHookRouter };
