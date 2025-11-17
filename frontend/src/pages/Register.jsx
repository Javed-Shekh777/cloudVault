// Register.jsx
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "../redux/api";
import { useDispatch } from "react-redux";

export default function Register() {
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
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
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      dispatch(setCredentials(res)); // { user, token }
      // redirect to dashboard
      window.location.href = "/";
    } catch (err) {
      console.log(err);
      setErrors({ api: err.data?.error || "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl sm:p-8 p-5 space-y-5">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create your account</h1>
        <p className="text-sm text-gray-500 text-center">Join DriveClone today</p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }

              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
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
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? "Register..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Register */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">
            <FcGoogle className="text-xl" /> Sign up with Google
          </button>
          <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">
            <FaGithub className="text-xl text-gray-800" /> Sign up with GitHub
          </button>
          <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">
            <FaFacebook className="text-xl text-blue-600" /> Sign up with Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
