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
    console.log("🚀 SignUpPostController called");
    console.log("📝 Body:", req.body);
    console.log("📸 File:", req.file);

    const { signupUserName, signupFullName, signupEmail, signupPassword } =
      req.body;

    // Check if the file was uploaded successfully
    if (!req.file) {
      return res.status(400).send("Image file is required.");
    }

    const imageUrl = req.file.path;
    const imageFilename = req.file.filename;

    console.log("✅ imageUrl:", imageUrl);
    console.log("✅ imageFilename:", imageFilename);

    // Validate input fields
    if (
      !signupUserName ||
      !signupFullName ||
      !signupEmail ||
      !signupPassword ||
      !imageUrl
    ) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username: signupUserName });

    if (existingUser) {
      return res.status(409).send("Username already exists");
    }

    const newUser = await User.create({
      username: signupUserName,
      fullname: signupFullName,
      email: signupEmail,
      image: {
        url: imageUrl,
        filename: imageFilename,
      },
      password: signupPassword,
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id
    );

    // Get logged-in user info without password & refreshToken
    const loggedInUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    // Cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Set cookies and redirect
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("flashMessage", "Signup successful On The Website", {
        maxAge: 60000,
        httpOnly: true,
      })
      .redirect("/me");
  } catch (error) {
    console.error("❌ Error in SignUpPostController:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export { SignUpPageShow, SignUpPostController };
