import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
import Login from "../pages/auth/LOgin";
import Home from "../pages/Home";
import Register from "../pages/auth/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        
       {/* Guest-only routes */}
        <Route element={<GuestRoutes />}> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
