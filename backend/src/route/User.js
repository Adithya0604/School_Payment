import express from "express";
const UserRouter = express.Router();

import {
  userLogin,
  userRegister,
  userLogout,
  refreshTokenHandler,
} from "../controllers/User.js";

import { UserAuth } from "../middleWares/PaymentMiddleWare.js";

import {
  userRegisterMiddleWare,
  userLoginMiddleWare,
} from "../middleWares/UserMiddleWare.js";

// Routes
// # User Register
UserRouter.route("/register").post(userRegisterMiddleWare, userRegister);

// # User Login
UserRouter.route("/login").post(userLoginMiddleWare, userLogin);

// # User RefreshToken
UserRouter.route("/refreshToken").post(refreshTokenHandler);

// # User LogOut
UserRouter.route("/logout").post(userLogout);

export default UserRouter;
