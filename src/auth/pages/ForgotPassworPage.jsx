import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ForgotPasswordPage = () => {
  const { resetPass } = useAuth();
  const [email, setEmail] = useState("");
  const [msgInfo, setMsgInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMsgInfo(""); // Limpiar mensajes previos
    setIsLoading(true);

    const res = await resetPass(email);
    if (res.success) {
      setMsgInfo("Reset email sent. Check your inbox.");
    } else {
      setMsgInfo(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-full h-screen bg-[#1c2930] p-8 rounded-lg dark:bg-gray-800 justify-center items-center">
      <div className="flex flex-col text-white items-center justify-center mb-4">
        <h1 className="text-4xl sm:text-5xl font-bold ">
          MiOpenLab
        </h1>
        <p className="text-xl">Share your Job!</p>
      </div>
      <div className="flex flex-col gap-3 w-1/3 items-center justify-center bg-[#EAE0D5] p-8 rounded-xl dark:bg-gray-800 shadow-lg ">
        <h2 className="font-bold text-2xl ">Forgot Password</h2>
        <p className="">Please enter your email to reset your password.</p>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#bd9260] text-white px-4 py-2 rounded-lg hover:bg-[#ca9c6e] transition duration-150 ease-in-out 
            flex items-center justify-center min-w-[150px] min-h-[40px] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </button>
          {msgInfo && (
            <p
              className={`text-center mt-4 ${
                msgInfo.includes("Error") ? "text-red-500" : "text-gray-800"
              }`}
            >
              {msgInfo}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
