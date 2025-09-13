import ErrorCodes from "../middleWares/ErrorCodes.js";

async function PaymentStatusMiddleWare(request, response, next) {
  const { school_id } = request.query;
  const { collect_request_id } = request.params;

  try {
    const schoolIDRegex = /^[a-fA-F0-9]{24}$/;
    if (!schoolIDRegex.test(school_id) || typeof school_id !== "string") {
      return response
        .status(ErrorCodes.Bad_Request)
        .json({ success: false, Message: "Invalid SchoolID" });
    }

    const hexDecimal = /^[a-f0-9]{24}$/i;
    if (
      !hexDecimal.test(collect_request_id) ||
      typeof collect_request_id !== "string"
    ) {
      return response
        .status(ErrorCodes.Bad_Request)
        .json({ success: false, Message: "Invalid Collect Request ID" });
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default PaymentStatusMiddleWare;
