import axios from "axios";
import { useEffect, useState, createContext } from "react";
import Cookies from "js-cookie";

import PropType from "prop-types";

const initialState = {
  user: null,
  setUser: () => null,
  loading: true,
  logout: () => null,
};
export const AuthContext = createContext(initialState);

const AuthProvider = (props) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const logout = () => {
    Cookies.remove("authtoken");
    setUser(null);
    window.location.reload();
  };

  async function userDetsils() {
    try {
      const token = Cookies.get("authtoken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/users/me`,
        config
      );
      setUser(res.data);
      console.log(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    userDetsils();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropType.node.isRequired,
};

export default AuthProvider;
