import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    
  };

  return (
    <div className="w-full max-w-full sm:max-w-md bg-[#EAEOD5] p-8 rounded-lg ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
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
          <label className="block text-sm font-medium text-gray-700">Password</label>
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
      <div className="mt-4 text-right">
        <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
          Forgot Password?
        </a>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
      <div className="mt-6">
        <p className="text-center text-gray-500">or</p>
        <div className="mt-4 space-y-2">
          <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
            Log In with Google
          </button>

        </div>
      </div>

    </div>
  );
};

export default LoginForm;