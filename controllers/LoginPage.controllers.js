import { User } from "../models/user.models.js";
import { sendEmail } from "../utils/mail.utils.js";

// Common Method To Generate Access And Refresh Tokens....
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the database for the user.....
    user.refreshToken = refreshToken;

    // Save The Refresh Token Without Validating The User Model....
    // This is useful when you want to update a field without triggering validation rules.
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    res
      .status(500)
      .send("Something went wrong while generating referesh and access token");
  }
};

const LoginPageShow = async (req, res) => {
  try {
    const flashMessage = req.cookies.flashMessage;

    // Remove the flash message after reading it
    res.clearCookie("flashMessage");

    res.render("Authurization/Login.ejs", {
      flashMessage: flashMessage, // Pass the flash message to EJS
    });
  } catch (error) {
    console.error("Error rendering login page:", error);
    res.status(500).send("Internal Server Error");
  }
};

const LoginPagePostController = async (req, res) => {
  try {
    const { loginUserName, loginEmail, loginPassword } = req.body;

    // Validate input fields....
    if (!loginUserName || !loginEmail || !loginPassword) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user exists in the database Based on username or email
    const user = await User.findOne({
      $or: [{ userName: loginUserName }, { email: loginEmail }],
    });

    // When the user is not found in the database....
    if (!user) {
      return res.status(401).send("Invalid username or email");
    }

    // We Have To Use The Object Instance Of The User Model.....

    // 'isPasswordCorrect' is a method defined in the User model that checks
    // if the provided password matches the hashed password stored in the database.
    const isPasswordCorrect = await user.isPasswordCorrect(loginPassword);

    // When the password is incorrect....
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid password");
    }

    // Regenerate the access and refresh tokens for the user....
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken "
    );

    // Send a welcome email to the user after successful login....
    sendEmail(loggedInUser.username, loggedInUser.email);

    // These Options Will Make The Cookie TO Be Only Accessible By The Server....
    // This means that the cookie cannot be accessed via JavaScript in the browser (e.g., document.cookie).
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Set the refresh token in the cookie with HttpOnly and Secure flags....
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("flashMessage", "Login successful On The Website", {
        maxAge: 60000,
        httpOnly: true,
      })
      .redirect("/me"); // Redirect to /me after setting cookies
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
};

const LogOutUserController = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .cookie("flashMessage", "You have successfully logged out", {
      maxAge: 60000,
      httpOnly: true,
    })
    .redirect("/login"); // Redirect to login page after logout
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if the refresh token in the database matches the incoming refresh token.....
    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token is expired or used" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        message: "Access token refreshed",
      });
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

export {
  LoginPageShow,
  LoginPagePostController,
  LogOutUserController,
  refreshAccessToken,
};
