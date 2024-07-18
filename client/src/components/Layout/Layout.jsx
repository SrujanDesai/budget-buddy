import React from "react";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Toaster />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
