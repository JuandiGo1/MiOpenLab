import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

const LoginForm = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="w-full max-w-full sm:max-w-md bg-[#EAEOD5] p-8 rounded-lg ">
      <h2 className="text-2xl font-bold text-[#1c2930] mb-6">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-white  border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#22333B] text-white py-2 px-4 rounded-md hover:bg-[#3c5a68] transition cursor-pointer"
        >
          Log In
        </button>
      </form>
      <div className="mt-4 text-center">
        <a
          href="/forgot-password"
          className="text-sm text-gray-500 hover:underline"
        >
          Forgot Password?
        </a>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <button
          onClick={() => setIsLogin(false)} // Cambia a SignupForm
          className="text-blue-900 font-bold hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </p>
      <div className="mt-4">
        <hr className="border-t border-gray-400 my-4" />
        <p className="text-center text-gray-500">or</p>
        <div className="mt-4 space-y-2">
          <button className="w-full bg-[#806248] text-white py-2 px-4 rounded-md hover:bg-[#ac8461] transition flex items-center justify-center gap-2 cursor-pointer">
            <FaGoogle className="text-2xl" /> Log In with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
