// contexts/AuthContext.js
import React from "react";
import axios from "axios";
import { config } from "../helpers/auth";
import Cookies from "js-cookie";

export const AuthContext = React.createContext(null);

export default function AuthContextProvider(props) {
  const [auth, setAuth] = React.useState(true);
  const [user, setUser] = React.useState(false);

  React.useEffect(() => {
    axios
      .get("/verify-token", config)
      .then((response) => {
        setUser(response.data);
        setAuth(true);
      })
      .catch(() => {
        setAuth(false);
        Cookies.remove("authToken");
      });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}
