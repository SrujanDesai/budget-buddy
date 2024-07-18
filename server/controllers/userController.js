const UserModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/authUtils");
const JWT = require("jsonwebtoken");

// Controller for Register (CallBack)
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Name is Required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is Required" });
    }

    // Check for Existing User
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Existing User! Please Login",
      });
    }

    // If Valid User then Hash the Password
    const hashedPassword = await hashPassword(password);

    // Save the user
    const user = await new UserModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration!",
      error,
    });
  }
};

// Controller for Login (CallBack)
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is Required" });
    }

    // Checking If User Exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Comparing Passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Creating Token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// Exports
module.exports = { registerController, loginController };
