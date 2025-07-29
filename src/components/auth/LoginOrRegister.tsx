import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface LoginOrRegisterProps {
  showRegister: boolean;
  setShowRegister: (showRegister: boolean) => void;
}

const LoginOrRegister = ({
  showRegister,
  setShowRegister,
}: LoginOrRegisterProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-600 rounded-lg p-1">
          <button
            onClick={() => setShowRegister(false)}
            className={`px-4 py-2 rounded-md  cursor-pointer transition-colors ${
              !showRegister
                ? "bg-white text-amber-600 shadow-sm"
                : "text-gray-200 hover:text-white "
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
              showRegister
                ? "bg-white text-amber-600  shadow-sm"
                : "text-gray-200 hover:text-white "
            }`}
          >
            Register
          </button>
        </div>
      </div>
      {showRegister ? <RegisterForm /> : <LoginForm />}
    </div>
  );
};

export default LoginOrRegister;
