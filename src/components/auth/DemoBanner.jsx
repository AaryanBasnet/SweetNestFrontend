import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/user/useAuth";

/** A slim bar telling someone they are in a shared demo account. */
export default function DemoBanner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user?.isDemo) return null;

  const isAdmin = user.role === "admin";

  const handleExit = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full bg-dark text-cream text-xs sm:text-sm px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
      <span>
        You're exploring the{" "}
        <strong className="font-semibold">{isAdmin ? "admin" : "customer"} demo</strong>.{" "}
        {isAdmin
          ? "Everything is visible, but changes are turned off."
          : "Payments run on eSewa's sandbox, so nothing is charged."}
      </span>
      <button
        type="button"
        onClick={handleExit}
        className="underline underline-offset-2 text-accent hover:text-white transition-colors"
      >
        Exit demo
      </button>
    </div>
  );
}
