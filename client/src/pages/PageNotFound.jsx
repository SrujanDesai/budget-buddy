import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { GiBrokenArrow } from "react-icons/gi";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };
  return (
    <Layout>
      <div className="bg-slate-950 flex flex-col items-center justify-center h-screen text-white">
        <GiBrokenArrow size={50} />
        <h1 className="text-center text-7xl lg:text-9xl font-bold mb-4">404</h1>
        <h1 className="text-center text-2xl font-bold mb-4">Page Not Found</h1>
        <button
          onClick={handleGoBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Go Back to Home
        </button>
      </div>
    </Layout>
  );
};

export default PageNotFound;
