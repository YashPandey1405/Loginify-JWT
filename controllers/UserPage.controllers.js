import { User } from "../models/user.models.js";

const UserPage = async (req, res) => {
  try {
    const flashMessage = req.cookies.flashMessage;
    // Remove the flash message after reading it
    res.clearCookie("flashMessage");

    const allUsers = await User.find().select("-password");

    if (!allUsers) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.render("PostLoginWelcome.ejs", {
      User: allUsers, // Pass allUsers
      flashMessage: flashMessage, // Pass the flash message to EJS
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { UserPage };
