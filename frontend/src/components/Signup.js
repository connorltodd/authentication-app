// components/signup.js
import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Signup() {
  const [state, setState] = React.useState({});
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("/register", state).then((response) => {
      alert("user has been signed up successfully");
      history.push("/login");
    });
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <p>Signup</p>
      <form onSubmit={handleSubmit}>
        <p>Email</p>
        <input name="email" value={state.email} onChange={handleChange} />
        <br />
        <p>Password</p>
        <input name="password" value={state.password} onChange={handleChange} />
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
export default Signup;
