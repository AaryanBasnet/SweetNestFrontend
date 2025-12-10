import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Mail, ArrowLeft } from "lucide-react";

import { forgotPasswordApi } from "../../api/user/authApi";
import { Input } from "../../components/ui/Input";
import { AuthButton } from "../../components/ui/AuthButton";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await forgotPasswordApi({ email: values.email });
        toast.success("Reset code sent to your email!");
        navigate("/verify-code", { state: { email: values.email } });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to send reset code"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="w-screen min-h-screen bg-white font-body">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <h1 className="font-heading text-2xl text-dark">
          SweetNest<span className="text-accent"> .</span>
        </h1>
      </div>

      {/* Centered Card */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h1 className="font-heading text-3xl text-center text-dark mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-center mb-8">
            No worries, we'll send you reset instruction
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder=""
              icon={Mail}
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
            />

            <AuthButton type="submit" isLoading={isLoading}>
              Reset Password
            </AuthButton>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-dark hover:text-accent mt-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
