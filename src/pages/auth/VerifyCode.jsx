import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

import { verifyResetCodeApi, forgotPasswordApi } from "../../api/user/authApi";
import { AuthButton } from "../../components/ui/AuthButton";

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Mask email for display (e.g., "te***@gmail.com")
  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 2) + "***";
    return `${maskedName}@${domain}`;
  };

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setCode(newCode);

    // Focus last filled input or next empty
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await verifyResetCodeApi({ email, code: fullCode });
      toast.success("Code verified successfully!");
      navigate("/reset-password", { state: { email, code: fullCode } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await forgotPasswordApi({ email });
      toast.success("New code sent to your email!");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

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
            Enter your code
          </h1>
          <p className="text-gray-500 text-center mb-8">
            we sent a code to {maskEmail(email)}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input Boxes */}
            <div className="flex justify-center gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg
                    focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
              ))}
            </div>

            <AuthButton type="submit" isLoading={isLoading}>
              Continue
            </AuthButton>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't receive email ?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-accent hover:underline font-medium disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Click here"}
            </button>
          </p>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-dark hover:text-accent mt-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
