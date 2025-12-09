import useAuthStore from "../../stores/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    token,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    logout,
    updateUserState: updateUser,
  };
};
