import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAccount } from "../context/AccountContext";

const AccountList = () => {
  const { accounts, setAccounts } = useAccount();
  const [editAccount, setEditAccount] = useState(null);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/account/get-accounts`,
          { owner: auth.user._id }
        );
        if (res.data.success) {
          setAccounts(res.data.accounts);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to Get Accounts!");
      }
    };

    fetchAccounts();
  }, [setAccounts]);

  const handleDeleteAccount = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/account/delete-account/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Remove the deleted account from the local state
        setAccounts(accounts.filter((account) => account._id !== id));
        // Remove the selected account from local storage if it matches the deleted account
        const selectedAccount = JSON.parse(
          localStorage.getItem("selectedAccount")
        );
        if (selectedAccount && selectedAccount._id === id) {
          localStorage.removeItem("selectedAccount");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to Delete Account!");
    }
  };

  const handleEditAccount = (account) => {
    setEditAccount(account);
    setName(account.name);
    setBalance(account.balance);
  };

  const handleUpdateAccount = async () => {
    try {
      const updatedAccount = { ...editAccount, name, balance };
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/account/update-account/${editAccount._id}`,
        updatedAccount
      );
      console.log(res);
      if (res.data.success) {
        toast.success("Account Updated Successfully!");
        // Update the account in the local state
        setAccounts(
          accounts.map((acc) =>
            acc._id === editAccount._id ? updatedAccount : acc
          )
        );
        // Clear the edit state and input fields
        setEditAccount(null);
        setName("");
        setBalance("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to Update Account!");
    }
  };

  const handleGoIn = (account) => {
    // Set the selected account in local storage
    localStorage.setItem("selectedAccount", JSON.stringify(account));
    // Redirect the user to the expense/income management page
    // Replace '/expense-income-management' with your actual route
    window.location.href = "/dashboard";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-950">
      {accounts.map((account) => (
        <div
          key={account._id}
          className="bg-slate-700 rounded-xl shadow-md p-4 flex flex-col justify-between border"
        >
          <div>
            {editAccount && editAccount._id === account._id ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2 px-4 py-2 border bg-slate-500 border-gray-300 rounded-md focus:outline-none focus:border-black text-white"
                />
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="mb-2 px-4 py-2 border bg-slate-500 border-gray-300 rounded-md focus:outline-none focus:border-black text-white"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-white">
                  {account.name}
                </h1>
                <p className="text-lg text-gray-100">
                  Balance: <span className="font-bold">{account.balance}</span>
                </p>
              </>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-x-2">
              {!editAccount || editAccount._id !== account._id ? (
                <>
                  <button
                    onClick={() => handleDeleteAccount(account._id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <MdDelete size={20} />
                  </button>
                  <button
                    onClick={() => handleEditAccount(account)}
                    className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                  >
                    <MdEdit size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleUpdateAccount}
                  className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-700 focus:outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div>
              <button
                onClick={() => handleGoIn(account)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
              >
                Go in
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountList;
