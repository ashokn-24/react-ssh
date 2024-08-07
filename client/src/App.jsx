/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleLogout = () => {
    axios.get("http://localhost:3000/logout").then(() => {
      setUser(null);
    });
  };

  console.log(loading, user);
  return (
    <Router>
      <main>
        {loading ? (
          <h1>loading.......</h1>
        ) : (
          <div className="box">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    user={user}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  user != null ? (
                    <Profile user={user} onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
        )}
      </main>
    </Router>
  );
};

export default App;
