import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({ label, icon: Icon, type = "text", error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 font-body">
      {/* Label */}
      {label && (
        <label className="text-sm text-dark font-medium">{label}</label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        )}

        {/* Input */}
        <input
          type={inputType}
          className={`
            w-full rounded-lg border bg-white p-3 pl-10 text-dark
            outline-none transition
            focus:border-accent focus:ring-1 focus:ring-accent
            ${error ? "border-red-500" : "border-gray-300"}
            ${isPassword ? "pr-10" : ""}
          `}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-accent transition"
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
