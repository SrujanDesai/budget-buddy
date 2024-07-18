// accountModel.js
const mongoose = require("mongoose");

// Account Schema
const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

// Account Model
const AccountModel = mongoose.model("Account", accountSchema);

// Export
module.exports = AccountModel;
