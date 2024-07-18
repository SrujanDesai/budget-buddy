import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import Layout from "../../components/Layout/Layout";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import { toast } from "react-hot-toast";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frequency, setFrequency] = useState("365");
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [edit, setEdit] = useState(null);
  const [account, setAccount] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchAccount = () => {
      try {
        const accountData = JSON.parse(localStorage.getItem("selectedAccount"));
        if (accountData) {
          setAccount(accountData);
        }
      } catch (error) {
        console.error("Error fetching Accounts:", error);
      }
    };

    fetchAccount();
  }, []);

  useEffect(() => {
    calculateTotalIncomeAndExpense();
  }, [expenses]);

  const calculateTotalIncomeAndExpense = () => {
    let calculateIncome = 0;
    let calculateExpense = 0;
    expenses.forEach((expense) => {
      if (expense.type === "Income") {
        calculateIncome += parseInt(expense.amount);
      } else if (expense.type === "Expense") {
        calculateExpense += parseInt(expense.amount);
      }
    });
    setTotalIncome(calculateIncome);
    setTotalExpense(calculateExpense);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchExpenses = async () => {
    try {
      const selectedAccount = JSON.parse(
        localStorage.getItem("selectedAccount")
      );
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/expense/get-expense`,
        {
          account: selectedAccount._id,
          frequency,
          selectedDate,
          type,
        }
      );
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [frequency, selectedDate, type]);

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const editExpense = (expense) => {
    setEdit(expense);
    setIsModalOpen(true);
  };

  const deleteExpense = async (expense) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/expense/delete-expense/${expense._id}`
      );

      // Update expenses state by removing the deleted expense
      setExpenses(expenses.filter((item) => item._id !== expense._id));

      // Update account balance based on the deleted expense
      const updatedBalance =
        expense.type === "Expense"
          ? account.balance + parseInt(expense.amount)
          : account.balance - parseInt(expense.amount);

      // Update the account balance in the backend
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/account/update-account/${account._id}`,
        { balance: updatedBalance }
      );

      // Update account state with the new balance
      setAccount({ ...account, balance: updatedBalance });

      // Update local storage with the updated account data
      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...account, balance: updatedBalance })
      );

      if (res.data && res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense!");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-slate-950">
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="bg-green-200 border-2 border-green-500 rounded-xl p-4 text-center">
              <h1 className="text-xl font-semibold">Income</h1>
              <p className="text-3xl text-green-700"> {totalIncome}</p>
            </div>

            <div className="bg-teal-100 border-2 border-teal-500 rounded-xl shadow-md p-4 text-center">
              <h1 className="text-2xl font-semibold">{account.name}</h1>
              <p className="text-3xl text-teal-700">{account.balance}</p>
            </div>

            <div className="bg-red-300 border-2 border-red-500 rounded-xl shadow-md p-4 text-center">
              <h1 className="text-xl font-semibold">Expense</h1>
              <p className="text-3xl font-bold text-red-700">{totalExpense}</p>
            </div>
          </div>

          <div className="p-4 md:flex md:justify-center lg:flex lg:items-center lg:mt-5 lg:mx-16">
            <div className="mb-4 md:w-1/3 md:mr-2 text-white">
              <h6>Select Frequency</h6>
              <select
                value={frequency}
                className="w-full lg:w-72 bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400"
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="7">Last 1 Week</option>
                <option value="30">Last 1 Month</option>
                <option value="365">Last 1 Year</option>
                <option value="custom">Custom</option>
              </select>
              {frequency === "custom" && (
                <RangePicker
                  value={selectedDate}
                  onChange={(dates) => {
                    setSelectedDate(dates);
                  }}
                />
              )}
            </div>
            <div className="mb-4 md:w-1/3 md:mx-2">
              <h6 className="text-white">Select Type</h6>
              <select
                value={type}
                className="w-full lg:w-72 bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="md:w-full lg:w-1/3 lg:pt-2">
              <button
                className="w-full lg:w-2/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={openModal}
              >
                Add New
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 bg-slate-500 border border-white rounded-xl">
            <table className="w-full border bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">
                    Amount
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">
                    Type
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">
                    Category
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">
                    Reference
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="px-6 py-4 whitespace-no-wrap border">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border">
                      {expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border">
                      {expense.type}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border">
                      {expense.reference}
                    </td>
                    <td className="flex justify-evenly px-6 py-4 whitespace-no-wrap border">
                      <button
                        onClick={() => editExpense(expense)}
                        className="hover:text-blue-300 hover text-blue-500"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense)}
                        className="text-red-500 hover:text-red-300"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        edit={edit}
        deleteExpense={deleteExpense}
      />
    </Layout>
  );
};

export default Dashboard;
