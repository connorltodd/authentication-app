// components/profile.js
import React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

export default function Profile() {
  const { user } = React.useContext(AuthContext);
  const history = useHistory();

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button
        onClick={() => {
          Cookies.remove("authToken");
          history.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
