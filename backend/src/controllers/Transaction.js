import mongoose from "mongoose";

// Get all transactions 
export async function Transaction(_, res) {
  try {
    const transactions = await mongoose.connection.db
      .collection("orders")
      .aggregate([
        {
          $lookup: {
            from: "orderstatuses", 
            localField: "_id", 
            foreignField: "collect_id", 
            as: "status_info",
          },
        },
        {
          $unwind: { path: "$status_info", preserveNullAndEmptyArrays: true }, 
        },
        {
          $project: {
            order_id: "$_id",
            collect_id: "$status_info.collect_id",
            school_id: 1,
            trustee_id: 1,
            gateway_name: 1, 
            collect_request_id: 1, 
            order_amount: "$status_info.order_amount",
            transaction_amount: "$status_info.transaction_amount",
            payment_mode: "$status_info.payment_mode",
            status: "$status_info.status",
            payment_time: "$status_info.payment_time",
            createdAt: 1,
          },
        },
      ])
      .toArray();

    res.json(transactions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Get all transactions for a specific school
export async function TransactionSchool(req, res) {
  const { schoolId } = req.params;
  try {
    const transactions = await mongoose.connection.db
      .collection("orders")
      .aggregate([
        { 
          $match: { 
            school_id: new mongoose.Types.ObjectId(schoolId) 
          } 
        },
        {
          $lookup: {
            from: "orderstatuses", 
            localField: "_id", 
            foreignField: "collect_id",
            as: "status_info",
          },
        },
        {
          $unwind: { path: "$status_info", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            order_id: "$_id",
            collect_id: "$status_info.collect_id",
            school_id: 1,
            trustee_id: 1,
            gateway_name: 1,
            collect_request_id: 1,
            order_amount: "$status_info.order_amount",
            transaction_amount: "$status_info.transaction_amount",
            payment_mode: "$status_info.payment_mode",
            status: "$status_info.status",
            payment_time: "$status_info.payment_time",
            createdAt: 1,
          },
        },
      ])
      .toArray();

    res.json(transactions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Get status for a specific order using collect_request_id
export async function TransactionStatus(req, res) {
  const { collect_request_id } = req.params; 
  try {
    // First find the order
    const order = await mongoose.connection.db
      .collection("orders")
      .findOne({ collect_request_id });

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Then find the status using the order's _id
    const status = await mongoose.connection.db
      .collection("orderstatuses") 
      .findOne({ collect_id: order._id });

    if (!status) return res.status(404).json({ error: "Status not found" });
    
    res.json(status);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
