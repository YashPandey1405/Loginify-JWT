import { User } from "../models/user.models.js";

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

const SignUpPageShow = async (req, res) => {
  try {
    res.render("Authurization/Signup.ejs");
  } catch (error) {
    console.error("Error rendering Signup page:", error);
    res.status(500).send("Internal Server Error");
  }
};

const SignUpPostController = async (req, res) => {
  try {
    const { signupUserName, signupFullName, signupEmail, signupPassword } =
      req.body;

    // Validate input fields....
    if (!signupUserName || !signupFullName || !signupEmail || !signupPassword) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({
      username: signupUserName,
    });

    // When the user is already found in the database....
    if (existingUser) {
      res.status(409).send("Username already exists");
    }

    const newUser = await User.create({
      username: signupUserName,
      fullname: signupFullName,
      email: signupEmail,
      password: signupPassword,
    });

    // Regenerate the access and refresh tokens for the user....
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id
    );

    const loggedInUser = await User.findById(newUser._id).select(
      "-password -refreshToken "
    );

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
      .redirect("/me"); // Redirect to /me after setting cookies
  } catch (error) {
    console.error("Error in SignUpPostController:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { SignUpPageShow, SignUpPostController };
