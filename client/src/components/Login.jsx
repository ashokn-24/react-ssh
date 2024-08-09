import {
  MicrosoftLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";

const Login = () => {
  const handleLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };
  return (
    <div
      id="login-page"
      className="flex items-center flex-col justify-center min-h-screen font-mono bg"
    >
      <h1 className="text-center p-5 sm:text-base text-white text-[30px] font-bold xl:text-[40px] xl:my-3">
        Login Page
      </h1>

      <div
        id="login-card"
        className="flex flex-col space-y-4 p-10  rounded-md bg-zinc-300 shadow-xl border-zinc-500 mx-12 w-[340px] h-[450px]"
      >
        <div className="flex justify-center mb-5">
          <img src="../public/logo.png" className="h-24 w-24" />
        </div>
        <div id="google-btn" className="text-center my-5 py-5">
          <GoogleLoginButton onClick={() => handleLogin("google")}>
            <span className="text-base">Login with Google</span>
          </GoogleLoginButton>
        </div>
        <div id="microsoft-btn" className="text-center my-5 py-5 ">
          <MicrosoftLoginButton
            onClick={() => handleLogin("microsoft")}
            className="text-[10px]"
          >
            <span className="text-base"> Login with Microsoft</span>
          </MicrosoftLoginButton>
        </div>
      </div>
    </div>
  );
};

export default Login;
