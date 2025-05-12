import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { NewLoader } from "../../common/components/Loader";

const SignupForm = ({ setIsLogin }) => {
  const { register, loginGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msgInfo, setMsgInfo] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMsgInfo("Username cannot be empty or only spaces!");
      return;
    }

    if (password !== confirmPassword) {
      setMsgInfo("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const res = await register(email, password, username);
    if (res.success) {
      setMsgInfo("User registered successfully!");
      navigate("/home");
    } else {
      setMsgInfo(res.message);
    }
    setIsLoading(false);
  };



  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginGoogle();
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      setMsgInfo("Error signing in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full sm:max-w-md bg-[#EAEOD5] p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-[#1c2930] mb-6 dark:text-white">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
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
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter an username"
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
            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter your password"
            required
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Confirm your password"
            required
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-[#22333B] text-white py-2 px-4 rounded-md hover:bg-[#3c5a68] dark:bg-[#3c6578]  transition duration-300 ease-in-out cursor-pointer"
        >
          {isLoading ? <NewLoader size="20" color="white" h="h-auto" /> : "Sign Up"}
        </button>
        {msgInfo && (
          <p className="mt-4 text-center text-sm text-red-950 dark:text-red-600 dark:text-shadow-4xs">{msgInfo}</p>
        )}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <button
            onClick={() => !isLoading && !isGoogleLoading && setIsLogin(true)} // Cambia a SignupForm
            disabled={isLoading || isGoogleLoading}
            className="text-blue-900 font-bold hover:underline cursor-pointer dark:text-blue-200"
          >
            Log In
          </button>
        </p>
        <div className="mt-4">
          <hr className="border-t border-gray-400 my-4" />
          <p className="text-center text-gray-500 dark:text-gray-300">or</p>
          <div className="mt-4 space-y-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-[#806248] text-white py-2 px-4 rounded-md hover:bg-[#ac8461] transition duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer dark:bg-[#6e553f] dark:hover:bg-[#664f3c]"
            >
              {isGoogleLoading ? <NewLoader size="20" color="white" h="h-auto" /> : (
                <>
                  <FaGoogle className="text-xl" /> Sign Up with Google
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
