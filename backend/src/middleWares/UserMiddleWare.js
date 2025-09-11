import { userConnect } from "../model/User.js";
import ErrorCodes from "./ErrorCodes.js";

async function userRegisterMiddleWare(request, response, next) {
  const { FirstName, LastName, Email, Password } = request.body;

  try {
    function ValidateMissingFields(requiredFields, data) {
      for (let field of requiredFields) {
        if (!(field in data)) {
          return `Field ${field} is Missing`;
        } else if (
          data[field] === null ||
          data[field] === undefined ||
          (typeof data[field] === "string" && data[field].trim() === "")
        ) {
          return `Data of ${field} is Missing.`;
        }
      }
      return null;
    }

    const MissingFields = ["FirstName", "LastName", "Email", "Password"];
    const AllFields = ValidateMissingFields(MissingFields, request.body);

    if (AllFields) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        MissingFields: AllFields,
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(Email)) {
      return response
        .status(400)
        .json({ success: false, message: `Invalid email.` });
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(Password)) {
      return response.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and contain letters and numbers",
      });
    }

    const ExistedUserEmail = await userConnect.findOne({ Email });

    if (ExistedUserEmail) {
      return response.status(ErrorCodes.Key_Duplicte).json({
        success: false,
        ExistedUser: "Email is already registered.",
      });
    }

    next();
  } catch (error) {
    return next(error);
  }
}

async function userLoginMiddleWare(request, response, next) {
  const { Email, Password } = request.body;

  try {
    const MissingFields = "Please make sure all required fields are entered";

    if (!Password || !Email) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        MissingFields,
      });
    }

    next();
  } catch (error) {
    return next(error);
  }
}

export { userRegisterMiddleWare, userLoginMiddleWare };
