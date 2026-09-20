import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRouter from "./routers/AppRouter";
import useAuthStore from "./stores/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/**
 * Application root: providers plus the router.
 *
 * This lives in its own file rather than inside main.jsx so React Fast Refresh
 * can hot-reload it during development. Fast Refresh only tracks components
 * from modules that export them - a component defined inline in the entry file
 * forces a full page reload on every edit, losing all application state.
 *
 * (The previous contents of this file were unused Vite starter boilerplate;
 * the real App was defined inline in main.jsx and this file was dead.)
 */
export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        theme="dark"
      />
    </QueryClientProvider>
  );
}
