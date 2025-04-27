import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    // Aquí puedes llamar a loginUser(email, password) desde authService.js
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
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
          <button className="w-full bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition">
            Log In with Twitter
          </button>
          <button className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition">
            Log In with Facebook
          </button>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Creators keep 94% of their earnings!</p>
        <p>Creators pay $25/mth or $240 yearly.</p>
      </div>
    </div>
  );
};

export default LoginForm;