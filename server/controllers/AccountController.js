// accountController.js
const AccountModel = require("../models/AccountModel");

// Create a new account
const createAccountController = async (req, res) => {
  try {
    const { name, balance, owner } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Name is Required" });
    }
    if (!balance) {
      return res.status(400).send({ message: "Balance is Required" });
    }
    if (!owner) {
      return res.status(400).send({ message: "owner is Required" });
    }

    // Save the new account into the AccountModel
    const account = await new AccountModel({ name, balance, owner }).save();

    // Saved Successfully
    res.status(201).send({
      success: true,
      message: "Account Created Successfully",
      account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Creating Account!",
      error,
    });
  }
};

// Get all accounts
const getAllAccountsController = async (req, res) => {
  try {
    // Find the account by the user's _id so that it is easy to bifercate the accounts
    const { owner } = req.body;
    const accounts = await AccountModel.find({ owner });

    // If Account not found
    if (!accounts) {
      return res.status(404).send({
        success: false,
        message: "No Accounts Found!",
      });
    }

    // Accounts Found Successfully
    res.status(200).send({
      success: true,
      message: "All Accounts Retreived!",
      accounts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Retreiving Accounts",
      error,
    });
  }
};

// Update account
const updateAccountController = async (req, res) => {
  try {
    // Destructure the name and balance to update
    const { name, balance } = req.body;

    // Find by account id and update the modified values
    const account = await AccountModel.findByIdAndUpdate(
      req.params.id,
      { name, balance },
      { new: true }
    );
    // If Account not found
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // Account Updated Successfully
    res.status(200).send({
      success: true,
      message: "Account Updated Successfully!",
      data: account,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

// Delete an account
const deleteAccountController = async (req, res) => {
  try {
    // Delete the account by id from params
    const account = await AccountModel.findByIdAndDelete(req.params.id);
    // If no accounts found
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Account Deleted Successfully
    res.status(200).send({
      success: true,
      message: "Account Deleted successfully",
      account,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting",
      error,
    });
  }
};

module.exports = {
  createAccountController,
  getAllAccountsController,
  updateAccountController,
  deleteAccountController,
};
