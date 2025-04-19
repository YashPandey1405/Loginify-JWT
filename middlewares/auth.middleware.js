import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

// Jane Se Pehle Mil Ke Jana.....
export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || null;

    // console.log(token);
    if (!token) {
      return res.status(401).send("Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).send("Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during JWT verification:", error);
    res.status(500).send("Internal Server Error");
  }
};
