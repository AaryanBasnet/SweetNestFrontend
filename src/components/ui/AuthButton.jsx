export const AuthButton = ({ children, isLoading, ...props }) => {
  return (
    <button
      className="w-full rounded-lg bg-[#4A3B32] py-3 text-white font-medium hover:bg-[#382b24] transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
