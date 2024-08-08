// src/HomePage.js

import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`http://localhost:3000/logout`, {
        withCredentials: true,
      });
      setUser(null);
      window.location.href = "/"; // Redirect to home page or login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/profile`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {!user ? (
        <div>
          <button onClick={() => handleLogin("google")}>
            Login with Google
          </button>
          <button onClick={() => handleLogin("microsoft")}>
            Login with Microsoft
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <p>Email: {user.email}</p>
          {user.picture && <img src={user.picture} alt="Profile" />}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;

// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import axios from "axios";

// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import Home from "./Home";
// import Profile from "./Profile";
// import Login from "./Login";

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get("http://localhost:3000/api/profile", { withCredentials: true })
//       .then((response) => {
//         console.log(response.data);
//         setUser(response.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setUser(null);
//         setLoading(false);
//       });
//   }, []);

//   const handleLogin = () => {
//     window.location.href = "http://localhost:3000/auth/google";
//   };

//   const handleLogout = () => {
//     axios.get("http://localhost:3000/logout").then(() => {
//       setUser(null);
//     });
//   };

//   console.log(loading, user);
//   return (
//     <Router>
//       <main>
//         {loading ? (
//           <h1>loading.......</h1>
//         ) : (
//           <div className="box">
//             <Routes>
//               <Route path="/login" element={<Home />} />
//               <Route
//                 path="/login"
//                 element={
//                   <Login
//                     user={user}
//                     onLogin={handleLogin}
//                     onLogout={handleLogout}
//                   />
//                 }
//               />
//               <Route
//                 path="/profile"
//                 element={
//                   user != null ? (
//                     <Profile user={user} onLogout={handleLogout} />
//                   ) : (
//                     <Navigate to="/" />
//                   )
//                 }
//               />
//             </Routes>
//           </div>
//         )}
//       </main>
//     </Router>
//   );
// };

// export default App;
