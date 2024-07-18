import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevents Refresh on Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password }
      );
      if (res.data.success) {
        toast.success(res.data && res.data.message);
        setLoading(false);
        navigate("/login");
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
      {loading && <Spinner />}
      <div className="min-h-screen flex justify-center items-center bg-slate-950 over">
        <div className="bg-slate-700 p-8 rounded-xl shadow-lg w-full sm:w-96">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Register
          </h2>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={name}
                className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-blue-400 text-white"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-white">
            Already a user?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
