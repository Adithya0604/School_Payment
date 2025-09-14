import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ErrorCodes from "../middleWares/ErrorCodes.js";
import userConnect from "../model/User.js";

const refreshTokens = new Set();

async function userRegister(request, response) {
  const { FirstName, LastName, Email, Password } = request.body;
  try {
    const CyrptedPassword = await bcrypt.hash(Password, 10);

    const user = await userConnect.create({
      FirstName,
      LastName,
      Email,
      Password: CyrptedPassword,
    });

    const Created_User = {
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      createdAt: user.createdAt,
    };

    if (user) {
      return response.status(201).json({ success: true, Created_User });
    } else {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        Created_User: "Unable to create the user. Please try again.",
      });
    }
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      Message:
        "There seems to be an internet connectivity issue. Please check your connection.",
    });
  }
}

async function userLogin(request, response) {
  const { Email, Password } = request.body;

  try {
    const ExistedUser = await userConnect
      .findOne({ Email })
      .select("+Password");

    if (!ExistedUser) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const isValidPassword = await bcrypt.compare(
      Password,
      ExistedUser.Password
    );

    if (!isValidPassword) {
      return response.status(ErrorCodes.Unauthorized).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const accessToken = JWT.sign(
      {
        email: ExistedUser.Email,
        firstName: ExistedUser.FirstName,
        lastName: ExistedUser.LastName,
        id: ExistedUser._id.toString(),
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = JWT.sign(
      { id: ExistedUser._id.toString() },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: "7d" }
    );

    refreshTokens.add(refreshToken);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        firstName: ExistedUser.FirstName,
        lastName: ExistedUser.LastName,
        email: ExistedUser.Email,
        createdAt: ExistedUser.createdAt,
      },
    });
  } catch (error) {
    return response
      .status(ErrorCodes.Bad_Request)
      .json({ error: error.message });
  }
}

async function refreshTokenHandler(request, response) {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return response
        .status(ErrorCodes.Unauthorized)
        .json({ message: "Refresh token required" });
    }

    if (!refreshTokens.has(refreshToken)) {
      return response
        .status(ErrorCodes.Forbidden)
        .json({ message: "Refresh token not found in valid tokens" });
    }

    let decoded;
    try {
      decoded = JWT.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
    } catch (verifyError) {
      refreshTokens.delete(refreshToken);
      return response.status(ErrorCodes.Forbidden).json({
        message: "Invalid token signature",
        error: verifyError.message,
      });
    }

    const user = await userConnect.findById(decoded.id);
    if (!user) {
      refreshTokens.delete(refreshToken);
      return response
        .status(ErrorCodes.Unauthorized)
        .json({ message: "User not found" });
    }

    const newAccessToken = JWT.sign(
      {
        id: user._id,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "5m" }
    );

    return response.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return response.status(ErrorCodes.Server_Error).json({
      message: "Internal server error during token refresh",
      error: err.message,
    });
  }
}

async function userLogout(request, response) {
  const refreshToken = request.cookies.refreshToken;

  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  response.clearCookie("refreshToken");
  return response.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

export { userRegister, userLogin, refreshTokenHandler, userLogout };
