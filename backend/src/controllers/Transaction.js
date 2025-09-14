import mongoose from "mongoose";

// Get all transactions (from webhook logs)
export async function Transaction(_, res) {
  try {
    const transactions = await mongoose.connection.db
      .collection("webhooklogs")
      .aggregate([
        {
          $project: {
            _id: 0,
            order_id: "$order_info.order_id",
            collect_request_id: "$order_info.collect_request_id",
            order_amount: "$order_info.order_amount",
            transaction_amount: "$order_info.transaction_amount",
            payment_mode: "$order_info.payment_mode",
            status: "$order_info.status",
            gateway: "$order_info.gateway",
            bank_reference: "$order_info.bank_reference",
            payment_time: "$order_info.payment_time",
            payment_message: "$order_info.payment_message",
          },
        },
        { $sort: { payment_time: -1 } },
      ])
      .toArray();

    res.json(transactions);
  } catch (e) {
    console.error("Transaction fetch error:", e);
    res.status(500).json({ error: e.message });
  }
}

// Get all transactions for a specific school (if school_id exists in order_info)
export async function TransactionSchool(req, res) {
  const { schoolId } = req.params;
  try {
    const transactions = await mongoose.connection.db
      .collection("webhooklogs")
      .aggregate([
        {
          $match: {
            "order_info.school_id": new mongoose.Types.ObjectId(schoolId),
          },
        },
        {
          $project: {
            _id: 0,
            order_id: "$order_info.order_id",
            collect_request_id: "$order_info.collect_request_id",
            order_amount: "$order_info.order_amount",
            transaction_amount: "$order_info.transaction_amount",
            payment_mode: "$order_info.payment_mode",
            status: "$order_info.status",
            gateway: "$order_info.gateway",
            bank_reference: "$order_info.bank_reference",
            payment_time: "$order_info.payment_time",
            payment_message: "$order_info.payment_message",
          },
        },
        { $sort: { payment_time: -1 } },
      ])
      .toArray();

    res.json(transactions);
  } catch (e) {
    console.error("Transaction fetch error:", e);
    res.status(500).json({ error: e.message });
  }
}

// Get status for a specific order using collect_request_id
export async function TransactionStatus(req, res) {
  const { collect_request_id } = req.params;
  try {
    const transaction = await mongoose.connection.db
      .collection("webhooklogs")
      .findOne(
        { "order_info.collect_request_id": collect_request_id },
        { projection: { _id: 0, order_info: 1, status: 1 } }
      );

    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });

    res.json(transaction);
  } catch (e) {
    console.error("Transaction fetch error:", e);
    res.status(500).json({ error: e.message });
  }
}
