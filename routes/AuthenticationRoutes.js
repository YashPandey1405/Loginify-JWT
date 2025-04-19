import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  LoginPageShow,
  LoginPagePostController,
  LogOutUserController,
  refreshAccessToken,
} from "../controllers/LoginPage.controllers.js";
import {
  SignUpPageShow,
  SignUpPostController,
} from "../controllers/SignUpPage.controllers.js";
import { UserPage } from "../controllers/UserPage.controllers.js";

const Router = express.Router();

Router.route("/").get(async (req, res) => {
  try {
    res.redirect("/login");
  } catch (error) {
    console.error("Error while redirecting login page:", error);
    res.status(500).send("Internal Server Error while redirecting login page");
  }
});

Router.route("/login").get(LoginPageShow).post(LoginPagePostController);
Router.route("/signup").get(SignUpPageShow).post(SignUpPostController);

// These routes are protected and require JWT verification....
Router.route("/logout").get(verifyJWT, LogOutUserController);
Router.route("/me").get(verifyJWT, UserPage);
Router.route("/refresh-token").post(refreshAccessToken);
export default Router;
