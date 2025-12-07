import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import AppRouter from "./routers/AppRouter";

import AuthProvider from "./auth/AuthProvider"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Global setting: Only retry failed requests once
      staleTime: 5 * 60 * 1000, // Data is "fresh" for 5 minutes
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* QueryClientProvider should wrap everything so AuthProvider can use it if needed */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          theme="dark"
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);