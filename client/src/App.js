import "antd/dist/reset.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/PrivateRoute";
import AccountPage from "./pages/user/AccountPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<Dashboard />} />
          <Route path="account-page" element={<AccountPage />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
