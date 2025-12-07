import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Mail, Lock, User, CheckCircle } from "lucide-react";

import { useAuth } from "../../hooks/user/useAuth";
import { registerSchema } from "../../schemas/authSchema";
import { Input } from "../../components/ui/Input";
import { AuthButton } from "../../components/ui/AuthButton";
import rightsideImage from "../../assets/auth_img.png";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword, ...apiData } = values;
        const result = await register(apiData);

        if (result.success) {
          toast.success("Account created successfully!");
          navigate("/dashboard");
        } else {
          toast.error(result.message || "Registration failed");
        }
      } catch (error) {
        toast.error("Unexpected error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="h-screen w-screen bg-white text-dark font-body flex overflow-hidden relative">
      {/* Logo */}
      <div className="absolute top-6 left-6 md:left-10 z-20">
        <h1 className="text-3xl font-heading font-bold text-dark">
          SweetNest<span className="text-accent"> .</span>
        </h1>
      </div>

      {/* LEFT SECTION */}
      <div className="w-full md:w-[45%] h-full flex items-center justify-center px-8 md:px-12 lg:px-20 z-10">
        <div className="w-full max-w-lg">
          <h1 className="text-[50px] font-heading text-dark text-center mb-2">
            Create Account
          </h1>
         

          {/* FORM */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={User}
              {...formik.getFieldProps("name")}
              error={formik.touched.name && formik.errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              icon={Lock}
              {...formik.getFieldProps("password")}
              error={formik.touched.password && formik.errors.password}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              icon={CheckCircle}
              {...formik.getFieldProps("confirmPassword")}
              error={
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword
              }
            />

            {/* BUTTON */}
            <AuthButton
              type="submit"
              isLoading={formik.isSubmitting}
              className="w-full h-[52px] bg-dark text-white rounded-lg text-lg font-medium 
                         hover:bg-[#1d1817] transition-all shadow-md"
            >
              Register
            </AuthButton>
          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:flex w-[55%] h-full relative">
        <img
          src={rightsideImage}
          alt="SweetNest Register"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
