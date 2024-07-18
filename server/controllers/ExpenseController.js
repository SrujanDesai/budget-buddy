const ExpenseModel = require("../models/ExpenseModel");
const AccountModel = require("../models/AccountModel");
const moment = require("moment");

// Controller for Fetching Expenses
const getAllExpenseController = async (req, res) => {
  try {
    const { account } = req.body;
    const { frequency, selectedDate, type } = req.body;

    // Find by account, type and frequency
    const expenses = await ExpenseModel.find({
      // Only include type if, it is not "all"
      ...(type !== "all" && { type }),
      // If frequency is "custom", filter expenses based on selected date range
      ...(frequency === "custom"
        ? {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }
        : {
            // Filter by date as per selected frequency
            date: {
              $gt: moment().subtract(Number(frequency), "day").toDate(),
            },
          }),

      account,
    });

    // If expenses not found
    if (!expenses) {
      return res.status(404).send({
        success: false,
        message: "No Expense Found!",
      });
    }

    // Expenses found
    res.status(200).send({
      success: true,
      message: "All Expenses Retrieved!",
      expenses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Expense!",
      error,
    });
  }
};

// Controller for Adding Expenses
const addExpenseController = async (req, res) => {
  try {
    const { amount, type, category, reference, description, date, account } =
      req.body;

    // Validation
    if (!amount) {
      return res.status(400).send({ message: "Amount is Required" });
    }
    if (!type) {
      return res.status(400).send({ message: "Type is Required" });
    }
    if (!category) {
      return res.status(400).send({ message: "Category is Required" });
    }
    if (!reference) {
      return res.status(400).send({ message: "Reference is Required" });
    }
    if (!description) {
      return res.status(400).send({ message: "Description is Required" });
    }
    if (!date) {
      return res.status(400).send({ message: "Date is Required" });
    }
    if (!account) {
      return res.status(400).send({ message: "Account is Required" });
    }

    // Add and save the destrucuted property in the ExpenseModel
    const newExpense = new ExpenseModel({
      amount,
      type,
      category,
      reference,
      description,
      date,
      account,
    });

    await newExpense.save();

    // Added successfully
    res.status(201).send({
      success: true,
      message: "Expense Added Successfully",
      newExpense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Adding Expense!",
      error,
    });
  }
};

// Controller for Edit Expense
const editExpenseController = async (req, res) => {
  try {
    const { amount, type, date, category, reference, description } = req.body;
    const { id } = req.params;

    // Find the expense by id and update its properties
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      id,
      {
        amount,
        type,
        date,
        category,
        reference,
        description,
      },
      // Return the updated document
      { new: true }
    );

    // Determine the difference between old and new amounts
    const oldExpense = await ExpenseModel.findById(id);
    const amountDifference = updatedExpense.amount - oldExpense.amount;

    // Update the associated account's balance
    const accountToUpdate = await AccountModel.findById(updatedExpense.account);
    if (!accountToUpdate) {
      return res.status(404).send({ message: "Account not found" });
    }
    if (type === "Expense") {
      accountToUpdate.balance -= amountDifference;
    } else if (type === "Income") {
      accountToUpdate.balance += amountDifference;
    }
    await accountToUpdate.save();

    // Updated Expense successfully
    res.status(200).send({
      success: true,
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Updating Expense",
      error,
    });
  }
};

// Controller for Delete Expense
const deleteExpenseController = async (req, res) => {
  try {
    // Destructure the id to find expense
    const { id } = req.params;
    // Find the expense by id
    const deletedExpense = await ExpenseModel.findById(id);

    // If no expense found corresponding to queried id
    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }
    // Delete the expense
    await deletedExpense.deleteOne();

    // Deleted Successfully
    res.status(200).send({
      success: true,
      message: "Expense Deleted successfully",
      del: deletedExpense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Delete Expense",
      error,
    });
  }
};

module.exports = {
  getAllExpenseController,
  addExpenseController,
  editExpenseController,
  deleteExpenseController,
};
