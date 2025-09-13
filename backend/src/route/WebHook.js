import express from "express";
import { WebHookStatus } from "../controllers/WebHooks.js";

const WebHookRouter = express.Router();

// POST webhook endpoint
WebHookRouter.post("/webhook", WebHookStatus);

export { WebHookRouter };
