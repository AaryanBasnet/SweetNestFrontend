import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Mail, KeyRound } from "lucide-react"; // Icons

// --- 1. Architecture Imports ---
import { useAuth } from "../../hooks/user/useAuth"; // Hook
import { loginSchema } from "../../schemas/authSchema"; // Validation (Yup)
import { Input } from "../../components/ui/Input"; // Reusable UI
import { AuthButton } from "../../components/ui/AuthButton"; // Reusable UI
import rightsideImage from "../../assets/auth_img.png"; // Your image
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const decoded = await login(values);
        toast.success("Login successful!");

        if (decoded?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-body relative flex">

      {/* Logo */}
      <div className="absolute top-6 left-10 z-20">
        <h1 className="font-heading text-h1 text-dark">
          SweetNest<span className="text-accent"> .</span>
        </h1>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-[45%] h-full flex items-center justify-center px-8 relative z-10 ">
        <div className="w-full max-w-lg">
          <h1 className="font-heading text-h1 text-center text-dark mb-9">
            Log in
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={KeyRound}
              {...formik.getFieldProps("password")}
              error={formik.touched.password && formik.errors.password}
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[16px] text-gray-600 hover:text-gray-800 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex justify-center mt-4">
              <AuthButton
                type="submit"
                isLoading={formik.isSubmitting}
                className="w-full h-[56px] bg-dark text-white rounded-lg text-[20px] font-medium hover:bg-[#1d1817] transition-all "
              >
                Login
              </AuthButton>
            </div>
          </form>

          <p className="text-base text-center text-gray-700 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-accent hover:underline font-medium"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:flex w-[55%] h-full relative">
        <img
          src={rightsideImage}
          alt="SweetNest Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
