/* eslint-disable react/prop-types */

const Home = ({ user }) => {
  const register = () => {};
  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <h3 onClick={register}>Click Here to Register</h3>
    </div>
  );
};

export default Home;
