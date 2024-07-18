// accountRoutes.js
const express = require("express");
const { signInRequired } = require("../middlewares/authMiddleware");
const {
  getAllAccountsController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
} = require("../controllers/AccountController");

// Router Object
const router = express.Router();

// CREATE Account with POST
router.post("/add-account", signInRequired, createAccountController);

// FETCH Accounts with POST
router.post("/get-accounts", signInRequired, getAllAccountsController);

// UPDATE Account with PUT
router.put("/update-account/:id", signInRequired, updateAccountController);

// DELETE Account with DELETE
router.delete("/delete-account/:id", signInRequired, deleteAccountController);

// Export
module.exports = router;
