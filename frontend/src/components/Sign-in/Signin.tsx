import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ApiError } from "../../utils/Response";

export default function Signin() {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const naviagte = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(email && password)) {
      setErrorMsg("All fields required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/v1/users/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server respons on log in: ", response);

      naviagte("/dashboard", { replace: true });
    } catch (error) {
        console.error("axios error: ",error)
      const axiosError = error as AxiosError<ApiError>;
      const payload = axiosError.response?.data;
      const msg =
        payload?.message ||
        payload?.errors?.[0] ||
        "An error occur while login";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className=" bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEamil(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in .." : "Log in"}
          </button>
        </form>
        <p className="w-full text-center">
          New user? {""}
          <Link
            to={"/sign-up"}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
