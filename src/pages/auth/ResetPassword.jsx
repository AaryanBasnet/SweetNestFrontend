import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Lock, ArrowLeft } from "lucide-react";

import { resetPasswordApi } from "../../api/user/authApi";
import { Input } from "../../components/ui/Input";
import { AuthButton } from "../../components/ui/AuthButton";

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no email/code in state
  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await resetPasswordApi({
          email,
          code,
          newPassword: values.password,
        });
        toast.success("Password reset successfully!");
        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to reset password"
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
            Set new password
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Must be at least 8 characters
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <Input
              label="New Password"
              type="password"
              placeholder=""
              icon={Lock}
              {...formik.getFieldProps("password")}
              error={formik.touched.password && formik.errors.password}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder=""
              icon={Lock}
              {...formik.getFieldProps("confirmPassword")}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
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
