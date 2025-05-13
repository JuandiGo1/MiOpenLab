import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NewLoader } from "../../common/components/Loader";

const LoginForm = ({ setIsLogin }) => {
  const { login, loginGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgInfo, setMsgInfo] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader del login normal
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Estado para el loader de Google

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsgInfo(""); // Limpiar mensajes previos
    setIsLoading(true); // Activar loader

    const res = await login(email, password);
    if (res.success) {
      setMsgInfo("Login successful!");
      navigate("/home"); // Redirige al usuario a la página principal
    } else {
      setMsgInfo(res.message); // Muestra el mensaje de error
    }
    setIsLoading(false); // Desactivar loader
  };

  const handleGoogleLogin = async () => {
    setMsgInfo(""); // Limpiar mensajes previos
    setIsGoogleLoading(true); // Activar loader
    try {
      await loginGoogle();
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      setMsgInfo("Error signing in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false); // Desactivar loader
    }
  };

  return (
    <div className="w-full max-w-full sm:max-w-md bg-[#EAE0D5] p-8 rounded-lg dark:bg-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold text-[#1c2930] mb-6 dark:text-white">
        Log In
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter your email"
            required
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-white  border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter your password"
            required
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading || isGoogleLoading}
          className="w-full bg-[#22333B] text-white py-2 px-4 rounded-md hover:bg-[#3c5a68] dark:bg-[#3c6578] transition duration-300 ease-in-out cursor-pointer"
        >
          {isLoading ? (
            <NewLoader size="20" color="white" h="h-auto" />
          ) : (
            "Log In"
          )}
        </button>
      </form>
      <div className="mt-4 text-center">
        <a
          href="/forgot-password"
          className="text-sm text-gray-500 hover:underline dark:text-blue-200"
        >
          Forgot Password?
        </a>
      </div>
      {msgInfo && (
        <p className="mt-4 text-center text-sm text-red-950 dark:text-red-600 dark:text-shadow-4xs">
          {msgInfo}
        </p>
      )}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Don’t have an account?{" "}
        <button
          onClick={() => !isLoading && !isGoogleLoading && setIsLogin(false)} // Cambia a SignupForm
          disabled={isLoading || isGoogleLoading}
          className="text-blue-900 font-bold hover:underline cursor-pointer dark:text-blue-200"
        >
          Sign Up
        </button>
      </p>
      <div className="mt-4">
        <hr className="border-t border-gray-400 my-4" />
        <p className="text-center text-gray-500 dark:text-gray-300">or</p>
        <div className="flex flex-col mt-4 space-y-2">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-[#806248] text-white py-2 px-4 rounded-md hover:bg-[#ac8461] transition duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer dark:bg-[#6e553f] dark:hover:bg-[#664f3c]"
          >
            {isGoogleLoading ? (
              <NewLoader size="20" color="white" h="h-auto" />
            ) : (
              <>
                <FaGoogle className="text-xl" /> Log In with Google
              </>
            )}
          </button>
          <button
            onClick={() => navigate("/home")} // Cambia a SignupForm
            disabled={isLoading || isGoogleLoading}
            className="text-gray-500 dark:text-gray-300  hover:underline cursor-pointer"
          >
            Continue without login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
