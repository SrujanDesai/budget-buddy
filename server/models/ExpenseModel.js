const mongoose = require("mongoose");

// Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

// Expense Model
const ExpenseModel = mongoose.model("expenses", expenseSchema);

// Export
module.exports = ExpenseModel;
