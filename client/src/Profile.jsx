/* eslint-disable react/prop-types */

const Profile = ({ user, onLogout }) => {
  console.log(user);

  return (
    <div>
      <img src={user.picture} height={100} width={100} />
      <h1>Hello, {user.displayName}</h1>
      <p>Email: {user.email}</p>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Profile;
