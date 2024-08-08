const Login = ({ user, onLogin, onLogout }) => {
  <div>
    {user ? (
      <div>
        <h1>Welcome, {user.displayName}</h1>
        <button onClick={onLogout}>Logout</button>
      </div>
    ) : (
      <button onClick={onLogin}>Login with Google</button>
    )}
  </div>;
};

export default Login;
