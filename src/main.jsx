import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./auth/AuthProvider";
import AppRouter from "./routers/AppRouter";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
