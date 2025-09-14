import ErrorCodes from "./ErrorCodes.js";
import JWT from "jsonwebtoken";


async function CreatePaymentMiddleWare(request, response, next) {
  const { school_id, amount, callback_url, user_upi } = request.body;

  try {

    const schoolID = /^[a-fA-F0-9]{24}$/;
    if (!schoolID.test(school_id) || typeof school_id !== "string") {
      return response
        .status(ErrorCodes.Bad_Request)
        .json({ success: false, Message: "Invalid SchoolID" });
    }


    const amountNumber = parseFloat(amount);
    if (amountNumber < 0 || isNaN(amountNumber)) {
      return response
        .status(ErrorCodes.Bad_Request)
        .json({ success: false, Message: "Invalid amount" });
    }

    try {
      new URL(callback_url);
    } catch (error) {
      return response
        .status(ErrorCodes.Bad_Request)
        .json({ success: false, Message: "Invalid callback_url" });
    }

    if (user_upi && typeof user_upi !== "string") {
      return response
        .status(ErrorCodes.Bad_Request)
        .json({ success: false, Message: "Invalid user_upi" });
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function UserAuth(request, response, next) {
  let AccessHeader = request.headers["authorization"];

  if (!AccessHeader || !AccessHeader.startsWith("Bearer")) {
    return response.status(401).json({ message: `No Token Provided` });
  }

  const accessToken = AccessHeader.split(" ")[1];

  try {
    const decrypted = JWT.verify(accessToken, process.env.ACCESS_SECRET_TOKEN);

    if (!decrypted || !decrypted.id) {
      return response.status(401).json({ message: "Invalid Token" });
    }

    request.user = decrypted;
    next();
  } catch (error) {
    return next(error);
  }
}

export { UserAuth, CreatePaymentMiddleWare };
