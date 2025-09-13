import { WebhookLog } from "../model/WebHooks.js";
import OrderStatus from "../model/OrderStatus.js";

export async function WebHookStatus(req, res) {
  try {
    const { status, order_info } = req.body;

    if (!order_info?.order_id || !order_info?.collect_request_id) {
      return res
        .status(400)
        .json({ error: "Missing order_id or collect_request_id" });
    }

    await WebhookLog.create({ status, order_info });

    await OrderStatus.updateOne(
      { order_id: order_info.order_id },
      {
        $set: {
          ...order_info,
          collect_request_id: order_info.collect_request_id, 
          webhook_status: status,
        },
      }
    );

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default WebHookStatus;
