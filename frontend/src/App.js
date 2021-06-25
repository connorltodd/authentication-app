import React from "react";
import { BrowserRouter, Switch, Link, Route, Redirect } from "react-router-dom";
import AuthContextProvider, { AuthContext } from "./contexts/AuthContext.js";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { auth } = React.useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <ProtectedRoute path="/profile" component={Profile} />
            <Redirect to="/login" />
          </Switch>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
