// UserProvider.js
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("userData");
    }
  }, [userData]);

  const logout = () => {
    setUserData(null);
    sessionStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("productsList");
    navigate("/Login");
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
