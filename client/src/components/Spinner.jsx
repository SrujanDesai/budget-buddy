import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => --prevCount);
    }, 1000);
    count === 0 &&
      navigate("/login", {
        state: location.pathname,
      });
    // Cleanup function
    return () => clearInterval(interval);
  }, [count, navigate]);
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
      <h1 className="text-center font-bold text-lg text-white">
        Redirecting you in {count}
      </h1>
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default Spinner;
