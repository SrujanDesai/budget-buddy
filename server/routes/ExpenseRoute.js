const express = require("express");
const {
  addExpenseController,
  getAllExpenseController,
  editExpenseController,
  deleteExpenseController,
} = require("../controllers/ExpenseController");
const { signInRequired } = require("../middlewares/authMiddleware");

// Router Object
const router = express.Router();

// Routes

// ADD EXPENSE with POST
router.post("/add-expense", signInRequired, addExpenseController);

// EDIT EXPENSE with PUT
router.put("/update-expense/:id", signInRequired, editExpenseController);

// DELETE EXPENSE with DELETE
router.delete("/delete-expense/:id", signInRequired, deleteExpenseController);

// GETING EXPENSE with POST
router.post("/get-expense", getAllExpenseController);

// Exports
module.exports = router;
