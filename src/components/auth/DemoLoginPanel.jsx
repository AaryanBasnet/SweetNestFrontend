import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LayoutDashboard, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/user/useAuth";
import { getSafeRedirect } from "../../utils/redirect";

// Shown only where the backend has demo accounts turned on
export const DEMO_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN === "true";

const DEMOS = [
  {
    role: "customer",
    label: "Customer demo",
    hint: "Shop, design a cake, check out",
    icon: ShoppingBag,
    to: "/",
  },
  {
    role: "admin",
    label: "Admin demo",
    hint: "Dashboard, orders, products (read-only)",
    icon: LayoutDashboard,
    to: "/admin",
  },
];

/**
 * One-click sign-in to the public demo accounts, so someone looking at the
 * project can try both sides of it without registering.
 */
export default function DemoLoginPanel() {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [pending, setPending] = useState(null);

  if (!DEMO_LOGIN_ENABLED) return null;

  const handleDemo = async ({ role, label, to }) => {
    if (pending) return;
    setPending(role);
    const result = await demoLogin(role);
    setPending(null);

    if (result.success) {
      toast.success(`Signed in to the ${label.toLowerCase()}`);
      // The customer demo returns to where the visitor was heading (say, checkout)
      navigate(role === "customer" ? getSafeRedirect(search, to) : to);
    } else {
      toast.error(result.message || "Demo sign-in is unavailable right now.");
    }
  };

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        Just looking around? Try a demo account
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {DEMOS.map((demo) => {
          const Icon = demo.icon;
          const isPending = pending === demo.role;
          return (
            <button
              key={demo.role}
              type="button"
              onClick={() => handleDemo(demo)}
              disabled={Boolean(pending)}
              className="flex items-start gap-3 text-left rounded-lg border border-gray-200 px-4 py-3 hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {isPending ? (
                <Loader2 size={20} className="text-accent mt-0.5 animate-spin shrink-0" />
              ) : (
                <Icon size={20} className="text-accent mt-0.5 shrink-0" />
              )}
              <span>
                <span className="block font-medium text-dark">{demo.label}</span>
                <span className="block text-xs text-gray-500 mt-0.5">{demo.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* eSewa's own public sandbox test account */}
      <details className="mt-4 text-xs sm:text-sm text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">
          Paying at checkout? Payments use eSewa's sandbox (no real money)
        </summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg bg-gray-50 px-4 py-3">
          <dt>eSewa ID</dt>
          <dd className="font-mono text-dark">9806800001</dd>
          <dt>Password</dt>
          <dd className="font-mono text-dark">Nepal@123</dd>
          <dt>MPIN / token</dt>
          <dd className="font-mono text-dark">1122 / 123456</dd>
        </dl>
      </details>
    </div>
  );
}
