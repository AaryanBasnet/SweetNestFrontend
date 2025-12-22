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
        const result = await login(values);

        if (result.success) {
          toast.success("Login successful!");

          if (result.user?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          toast.error(result.message || "Login failed. Please check your credentials.");
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-screen min-h-screen bg-white overflow-x-hidden font-body relative flex">

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:left-10 z-20">
        <h1 className="font-heading text-xl sm:text-2xl md:text-h1 text-dark">
          SweetNest<span className="text-accent"> .</span>
        </h1>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-[45%] min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 relative z-10">
        <div className="w-full max-w-md sm:max-w-lg">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-h1 text-center text-dark mb-6 sm:mb-9">
            Log in
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
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
                className="text-sm sm:text-base text-gray-600 hover:text-gray-800 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex justify-center mt-4">
              <AuthButton
                type="submit"
                isLoading={formik.isSubmitting}
                className="w-full h-12 sm:h-14 bg-dark text-white rounded-lg text-base sm:text-lg md:text-xl font-medium hover:bg-[#1d1817] transition-all"
              >
                Login
              </AuthButton>
            </div>
          </form>

          <p className="text-sm sm:text-base text-center text-gray-700 mt-4 sm:mt-6">
            Don't have an account?{" "}
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
      <div className="hidden md:flex w-[55%] h-screen fixed right-0 top-0">
        <img
          src={rightsideImage}
          alt="SweetNest Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
