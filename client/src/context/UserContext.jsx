import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
// Creating a context
const UserContext = createContext();

// Creating a context provider
const AuthProvider = ({ children }) => {
  // Initializing the state, user as null and token as empty
  const [auth, setAuth] = useState({ user: null, token: "" });

  // To make headers present in each request
  axios.defaults.headers.common["Authorization"] = auth?.token;

  // Creating a provider where the children will have access to the state
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslint-disable-next-line
  }, []);
  return (
    <UserContext.Provider value={[auth, setAuth]}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for UserContext
const useAuth = () => useContext(UserContext);

export { useAuth, AuthProvider };
