/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const Profile = ({ user }) => {
  const navigate = useNavigate();

  const userPfp = "/user.png";

  // Adding navigate as a dependency

  if (!user) {
    return (
      <div>
        <Nav />
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <Nav />
      <div className="flex flex-col justify-center items-center text-center min-h-screen p-58 bg-gray-100">
        <div
          id="profile-card"
          className="shadow-2xl rounded-xl bg-white w-80 mb-20"
        >
          <h1 className="text-center p-5">User Profile</h1>
          <div className="p-5 m-5 flex justify-center">
            {user.picture && (
              <img
                className="rounded-full align-center"
                src={user.picture}
                width={150}
                height={150}
                alt="Profile"
              />
            )}
          </div>
          <p className="p-4 m-3">Name: {user.displayName}</p>
          <p className="p-4 m-3">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import axios from "axios";

// const Profile = ({ user, setUser }) => {
//   const handleLogout = async () => {
//     try {
//       await axios.get(`http://localhost:3000/logout`, {
//         withCredentials: true,
//       });
//       setUser(null);
//       window.location.href = "/"; // Redirect to home page or login page after logout
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Welcome, {user.displayName}!</h2>
//       <p>Email: {user.email}</p>
//       {user.picture && <img src={user.picture} alt="Profile" />}
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default Profile;
