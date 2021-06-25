// components/login.js
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
  const [state, setState] = React.useState({});
  const { setUser, setAuth } = React.useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("/login", state).then((response) => {
      setUser(response.data.user);
      setAuth(true);
      Cookies.set("authToken", response.data.token);
      history.push("/profile");
    });
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <p>Login</p>
      <form onSubmit={handleSubmit}>
        <p>Email</p>
        <input name="email" value={state.email} onChange={handleChange} />
        <br />
        <p>Password</p>
        <input name="password" value={state.password} onChange={handleChange} />
        <br />
        <button type="submit">Login</button>
      </form>
      ;
    </div>
  );
}
export default Login;
