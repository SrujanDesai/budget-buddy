import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

const Modal = ({ isOpen, closeModal, edit }) => {
  const [amount, setAmount] = useState(edit ? edit.amount : 0);
  const [type, setType] = useState(edit ? edit.type : "");
  const [date, setDate] = useState(edit ? edit.date : "");
  const [category, setCategory] = useState(edit ? edit.category : "");
  const [reference, setReference] = useState(edit ? edit.reference : "");
  const [description, setDescription] = useState(edit ? edit.description : "");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
    try {
      let res;
      if (edit) {
        // If edit object exists, update the expense

        res = await axios.put(
          `${process.env.REACT_APP_API}/api/v1/expense/update-expense/${edit._id}`,
          {
            amount,
            type,
            date,
            category,
            reference,
            description,
          }
        );
      } else {
        // Otherwise, add a new expense
        res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/expense/add-expense`,
          {
            amount,
            type,
            date,
            category,
            reference,
            description,
            account: selectedAccount._id,
          }
        );

        // Update the account balance based on the transaction type
      }
      if (type === "Expense") {
        selectedAccount.balance -= parseInt(amount);
      } else if (type === "Income") {
        selectedAccount.balance += parseInt(amount);
      }
      localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));

      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/account/update-account/${selectedAccount._id}`,
        { name: selectedAccount.name, balance: selectedAccount.balance }
      );

      if (res.data.success) {
        toast.success(res.data && res.data.message);
        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add Expense!");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-200 bg-opacity-50 z-50 overflow-hidden">
          <div className="bg-slate-700 rounded-xl shadow-xl lg:w-1/2 w-3/4 p-3">
            <div className="flex justify-end p-4">
              <button
                className="focus:outline-none"
                onClick={closeModal}
                aria-label="Close"
              >
                <MdClose className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label
                  htmlFor="amount"
                  className="block font-medium text-white pb-2"
                >
                  Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                  placeholder="ex. $100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block font-medium text-white pb-2">
                  Type
                </label>
                <select
                  id="type"
                  className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                  value={type}
                  
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block font-medium text-white pb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block font-medium text-white pb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health & Medical">Health & Medical</option>
                  <option value="Education">Education</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Travel">Travel</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Taxes">Taxes</option>
                  <option value="Debt Payments">Debt Payments</option>
                  <option value="Investments">Investments</option>
                  <option value="Gifts & Donations">Gifts & Donations</option>
                  <option value="Subscriptions & Memberships">
                    Subscriptions & Memberships
                  </option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Childcare">Childcare</option>
                  <option value="Pet Care">Pet Care</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="reference"
                  className="block font-medium text-white pb-2"
                >
                  Reference
                </label>
                <input
                  type="text"
                  id="reference"
                  className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                  placeholder="Reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block font-medium text-white pb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full h-24 bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
