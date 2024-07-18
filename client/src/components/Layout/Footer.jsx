import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 h-16">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-4">
        <p className="text-sm lg:order-2">
          &copy; {new Date().getFullYear()} Budget Buddy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
