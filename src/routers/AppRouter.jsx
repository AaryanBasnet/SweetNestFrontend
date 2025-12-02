import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
import Login from "../pages/auth/LOgin";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
