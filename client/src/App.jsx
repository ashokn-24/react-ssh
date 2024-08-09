import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Navigate,
} from "react-router-dom";
import SurveyComponent from "./components/SurveyComponent";

const App = () => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      //https://localhost:3000/signin-microsoft
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
    <div className="flex flex-col min-h-full">
      {/* <h1 className="text-center">Login Page</h1> */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/survey-form" element={<SurveyComponent />} />
          <Route
            path="/profile"
            element={
              <Profile user={user} />
              // user != null ? <Profile user={user} /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
      {/* {!user ? <Login /> : <Profile user={user} setUser={setUser} />} */}
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
