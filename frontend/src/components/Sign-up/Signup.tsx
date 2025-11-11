import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import type { ApiError } from "../../utils/Response";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setChekingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [debouncedEmail] = useDebounce(email, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUniqueEmail = async () => {
      if (!debouncedEmail) {
        setErrorMessage("");
        setChekingEmail(false);
        return;
      }
      if (debouncedEmail && debouncedEmail.includes("@")) {
        setChekingEmail(true);
        setErrorMessage("");
        try {
          const response = await axios.get("/api/v1/users/unique-email",{params: { email: debouncedEmail }});
          console.log("AXIOS RESPONSE FROM SING-UP", response);
          setErrorMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const payload = axiosError.response?.data;
          const msg = payload?.message || payload?.errors?.[0] || "An error occurred while checking email";
          setErrorMessage(msg);
        } finally {
          setChekingEmail(false);
        }
      }
    };
    checkUniqueEmail();
  }, [debouncedEmail]);

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFileChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) {
      setAvatar(null);
      return;
    }
    const file = files[0];
    setAvatar(file);
  };

  const removeAvatar = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setAvatar(null);
    const fileInput =
      document.querySelector<HTMLInputElement>("input[name=avatar]");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();

    if(!(email && password && avatar && fullName)){
      setErrorMessage("All fields required");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName",fullName);
    formData.append("email",email);
    formData.append("password",password);
    formData.append("avatar",avatar);
    try {
      const response = await axios.post("/api/v1/users/register",formData,{withCredentials:true})
      
      console.log("Server response on register user",response.data);
      alert("Registration successful")
      navigate("/dashboard",{replace:true})
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const payload = axiosError.response?.data;
      const msg = payload?.message || payload?.errors?.[0] || "An error occur while registering user"
      setErrorMessage(msg);
    } finally{
      setLoading(false)
    }
  }
  return (
    <div className="w-full h-screen items-center justify-center bg-gray-100 flex">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center"> Sign Up</h2>
        <form className="space-y-4" encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-black/10 rounded-l-lg px-3 outline-none bg-white py-1.5"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/10 rounded px-3 py-1.5"
          />
          <div>
            {checkingEmail ? <span className="text-xs">Checking…</span> : null}
          </div>
          <p
            className={`text-sm ${
              errorMessage === "Email is available"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {errorMessage}
          </p>
          <div className="w-full flex">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="w-full border border-black/10 rounded-l-lg px-3 outline-none bg-white py-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={handlePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}
              className={`px-3 rounded-r-lg border-l border-black/10 
                ${
                  showPassword
                    ? "bg-blue-50 text-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              {/* Eye  */}
              {showPassword ? (
                /* Eye Off */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.58 10.58a3 3 0 104.84 4.84"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.12 9.88C15.32 10.6 16.29 11.6 17 12.8 18.7 16.35 15.21 19 12 19c-1.08 0-2.11-.25-3.02-.69"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.53 6.21C8.64 5.62 10.27 5 12 5c4.477 0 8.268 2.97 9.964 7.322a1.5 1.5 0 010 .356"
                  />
                </svg>
              ) : (
                /* Eye */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322C3.732 7.97 7.523 5 12 5c4.477 0 8.268 2.97 9.964 7.322a1.5 1.5 0 010 .356C20.268 16.03 16.477 19 12 19c-4.477 0-8.268-2.97-9.964-7.322a1.5 1.5 0 010-.356z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                  />
                </svg>
              )}
            </button>
          </div>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="w-full border border-black/10 rounded-l-lg px-3 outline-none bg-white py-1.5"
            onChange={handleFileChnage}
          />
          {avatar && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={URL.createObjectURL(avatar)}
                alt="avatar preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <p className="text-sm font-medium">{avatar.name}</p>
                <p className="text-xs text-gray-500">
                  {Math.ceil(avatar.size / 1000)} KB
                </p>
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-sm text-red-600 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
