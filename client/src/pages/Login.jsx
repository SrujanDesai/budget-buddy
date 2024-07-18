import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/UserContext";

const Login = () => {
  // States
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form Submit Logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        { email, password }
      );
      if (res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/dashboard/account-page");
      } else {
        toast.error(res.data && res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  // Protecting Routes
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center bg-slate-950 over">
        <div className="bg-slate-700 p-8 rounded-xl shadow-lg w-full sm:w-96">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="email" className="block text-white font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-slate-500  border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-gray-100">
            New user?
            <Link to="/register" className="text-blue-400 hover:underline pl-2">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
