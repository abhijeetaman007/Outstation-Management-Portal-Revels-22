import axios from "axios";
import React, { useContext, createContext, useState, useEffect } from "react";
//import { TOKEN_ID } from "../utils/constants";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user,setuser] = useState(false);
  const navigate = useNavigate();
  const restoreUser = async () => {
    const token = localStorage.getItem("tokenid=");
    if (token) {
      try {
        const token = localStorage.getItem("tokenid=");
        const res = await axios.get(`/om/getomuser`, {
          headers: {
            authorization: `${token}`,
          },
        });
        //console.log(res);
        if (res.data.success) {
          setuser(res.data.data);
          setLoading(false);
          navigate(`/dashboard/`);
        }
         else {
         localStorage.removeItem("tokenid=");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    restoreUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/om/login", {
        email,
        password,
      });
      //console.log(res.data);
      if (!res.data.success) return res.data;
      
      localStorage.setItem("tokenid=", res.data.data);
      restoreUser();
      return res.data;
    } catch (err) {
      //console.log(err.response);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setuser(null);
      localStorage.removeItem("tokenid=");
    } catch (err) {
      throw err;
    }
  };

  const value = {
    category,
    user,
    logout,
    login,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
