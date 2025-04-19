import { User } from "../models/user.models.js";

const UserPage = async (req, res) => {
  try {
    const flashMessage = req.cookies.flashMessage;
    // Remove the flash message after reading it
    res.clearCookie("flashMessage");

    const currentUser = await User.findById(req.user._id).select("-password");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.render("PostLoginWelcome.ejs", {
      User: req.user, // Pass currentUser
      flashMessage: flashMessage, // Pass the flash message to EJS
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { UserPage };
