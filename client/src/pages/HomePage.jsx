import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [loginUser, setLoginUser] = useState("");
  const navigate = useNavigate();

  // If user is logged in set the state
  useEffect(() => {
    const isUser = JSON.parse(localStorage.getItem("auth"));
    if (isUser) {
      setLoginUser(isUser.user);
    }
  }, []);

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  const handleAccountsPage = () => {
    navigate("/dashboard/account-page");
  };

  return (
    <Layout>
      <div className="bg-slate-950 flex flex-col items-center justify-center h-screen">
        <FaUserAlt size={200} className="text-white" />
        <h1 className="text-gray-100 text-center text-2xl font-bold mt-4">
          {loginUser && loginUser.name}
        </h1>
        <div className="flex gap-x-3">
          <button
            onClick={handleGoDashboard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Dashboard
          </button>
          <button
            onClick={handleAccountsPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Accounts
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
