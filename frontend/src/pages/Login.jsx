// Login.jsx
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login, setCredentials } from "../redux/authSlice";
import { useEffect } from "react";
import toast from 'react-hot-toast';



export default function Login() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      const res = await dispatch(login({
        email: form.email,
        password: form.password,
      })).unwrap();
      console.log(res);
      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.tokens.accessToken,
          refreshToken: res.data.tokens.refreshToken,
          deviceId: res.data.tokens.deviceId
        })
      );
      window.location.href = "/";
    } catch (err) {

      toast.error(err?.message || "Login failed");
      console.log("Error", err);
      setErrors({ api: err.data?.error || "Login failed" });
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl sm:p-8 p-5 space-y-5">
        <h1 className="text-2xl font-bold text-center text-gray-800">Sign in to DriveClone</h1>
        <p className="text-sm text-gray-500 text-center">Access your files securely</p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>

                setForm({ ...form, email: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="off"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            // disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {/* {isLoading ? "Login..." : "Login"} */}Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
          <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">
            <FaGithub className="text-xl text-gray-800" /> Continue with GitHub
          </button>
          <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">
            <FaFacebook className="text-xl text-blue-600" /> Continue with Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
